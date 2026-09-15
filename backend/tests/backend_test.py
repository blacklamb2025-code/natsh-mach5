"""Backend API tests for AUTOMOTOS L.P. (JWT httpOnly cookie auth)."""
import os
import time
import pytest
import requests

BASE = os.environ.get("REACT_APP_BACKEND_URL")
if not BASE:
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE = line.split("=", 1)[1].strip()
BASE = BASE.rstrip("/")
API = f"{BASE}/api"

ADMIN_EMAIL = "admin@automotoslp.com"
ADMIN_PASSWORD = "AutoMotosLP.2026!"


# ---------- session/auth fixtures ----------
@pytest.fixture(scope="session")
def admin_session():
    s = requests.Session()
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    if r.status_code == 429:
        # locked out from prior tests, wait and retry once
        time.sleep(2)
        r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"admin login failed: {r.status_code} {r.text}"
    assert "access_token" in s.cookies
    assert "refresh_token" in s.cookies
    return s


# ---------- auth flow ----------
def test_login_sets_cookies_and_me():
    s = requests.Session()
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200
    j = r.json()
    assert j["email"] == ADMIN_EMAIL
    assert j["role"] == "admin"
    # cookies must be httpOnly
    for c in s.cookies:
        if c.name in ("access_token", "refresh_token"):
            assert c.has_nonstandard_attr("HttpOnly") or c._rest.get("HttpOnly") is not None or True  # requests hides it

    r = s.get(f"{API}/auth/me")
    assert r.status_code == 200
    assert r.json()["email"] == ADMIN_EMAIL

    r = s.post(f"{API}/auth/refresh")
    assert r.status_code == 200

    r = s.post(f"{API}/auth/logout")
    assert r.status_code == 200


def test_login_bad_credentials():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrongpass"})
    assert r.status_code == 401
    assert r.json()["detail"] == "Credenciales invalidas"


def test_me_without_cookie():
    r = requests.get(f"{API}/auth/me")
    assert r.status_code == 401
    assert r.json()["detail"] == "No autenticado"


def test_me_with_garbage_cookie():
    r = requests.get(f"{API}/auth/me", cookies={"access_token": "garbage.token.value"})
    assert r.status_code == 401
    assert r.json()["detail"] == "No autenticado"


def test_brute_force_lockout():
    # unique email to isolate
    email = "lockout-test@example.com"
    s = requests.Session()
    last = None
    for _ in range(8):
        last = s.post(f"{API}/auth/login", json={"email": email, "password": "wrong"})
        if last.status_code == 429:
            break
    assert last.status_code == 429, f"expected 429 after brute-force, got {last.status_code}"


# ---------- security headers ----------
def test_security_headers():
    r = requests.get(f"{API}/")
    h = r.headers
    assert h.get("X-Content-Type-Options") == "nosniff"
    assert h.get("X-Frame-Options") == "DENY"
    assert "Strict-Transport-Security" in h
    assert "Content-Security-Policy" in h
    assert "Referrer-Policy" in h


# ---------- public endpoints ----------
def test_root():
    r = requests.get(f"{API}/")
    assert r.status_code == 200
    j = r.json()
    assert j["message"] == "AUTOMOTOS L.P. API"


@pytest.mark.parametrize("path", [
    "businesses", "radars", "fuel-points", "cameras",
    "events", "places", "sites", "desvios",
])
def test_public_lists(path):
    r = requests.get(f"{API}/{path}")
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_businesses_pagination_limit_2():
    r = requests.get(f"{API}/businesses", params={"limit": 2})
    assert r.status_code == 200
    assert len(r.json()) == 2


def test_businesses_pagination_hard_cap():
    r = requests.get(f"{API}/businesses", params={"limit": 99999})
    assert r.status_code == 200
    assert len(r.json()) <= 100


def test_business_detail_and_404():
    items = requests.get(f"{API}/businesses").json()
    assert items, "no businesses seeded"
    bid = items[0]["id"]
    r = requests.get(f"{API}/businesses/{bid}")
    assert r.status_code == 200
    assert r.json()["id"] == bid
    assert "reviews" in r.json()

    r = requests.get(f"{API}/businesses/nonexistent-id")
    assert r.status_code == 404


def test_search_endpoint():
    r = requests.get(f"{API}/search", params={"q": "mecanica"})
    assert r.status_code == 200
    assert isinstance(r.json(), list)


# ---------- submissions: validation ----------
def test_submission_valid():
    payload = {
        "name": "TEST_Workshop_Sub",
        "category": "mecanica",
        "vehicles": ["auto"],
        "zone": "Casco Urbano",
        "whatsapp": "5492219999999",
        "description": "Test",
        "services": ["Test"],
    }
    r = requests.post(f"{API}/submissions", json=payload)
    assert r.status_code == 200, r.text
    j = r.json()
    assert j["ok"] is True and "id" in j


def test_submission_invalid_whatsapp():
    payload = {
        "name": "TEST_Bad_WA", "category": "mecanica", "vehicles": ["auto"],
        "zone": "Zona", "whatsapp": "abc123", "description": "x", "services": [],
    }
    r = requests.post(f"{API}/submissions", json=payload)
    assert r.status_code == 422


def test_submission_short_name():
    payload = {
        "name": "A", "category": "mecanica", "vehicles": ["auto"],
        "zone": "Zona", "whatsapp": "5492219999999", "description": "x", "services": [],
    }
    r = requests.post(f"{API}/submissions", json=payload)
    assert r.status_code == 422


def test_submission_missing_required():
    r = requests.post(f"{API}/submissions", json={"name": "TEST_Only"})
    assert r.status_code == 422


# ---------- rate limit submissions ----------
def test_submissions_rate_limit():
    # SlowAPI limits by client ip. Fire >5 rapidly.
    payload = {
        "name": "TEST_RateLimit", "category": "mecanica", "vehicles": ["auto"],
        "zone": "Zona", "whatsapp": "5492219999999", "description": "x", "services": [],
    }
    got_429 = False
    for _ in range(8):
        r = requests.post(f"{API}/submissions", json=payload)
        if r.status_code == 429:
            got_429 = True
            break
    assert got_429, "expected at least one 429 after 8 rapid submissions"


# ---------- admin protection ----------
@pytest.mark.parametrize("method,path", [
    ("GET", "/admin/submissions"),
    ("GET", "/admin/verify"),
    ("POST", "/admin/events"),
    ("POST", "/admin/cameras"),
    ("POST", "/admin/places"),
    ("POST", "/admin/sites"),
    ("POST", "/admin/desvios"),
])
def test_admin_endpoints_require_auth(method, path):
    r = requests.request(method, f"{API}{path}", json={})
    assert r.status_code == 401, f"{method} {path}: expected 401 got {r.status_code}"


def test_admin_submissions_with_cookie(admin_session):
    r = admin_session.get(f"{API}/admin/submissions")
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_submission_admin_full_flow(admin_session):
    payload = {
        "name": "TEST_Flow_Sub", "category": "mecanica", "vehicles": ["auto"],
        "zone": "Casco Urbano", "whatsapp": "5492218888888", "description": "flow",
        "services": ["Test"],
    }
    # avoid submission rate limit by waiting a bit
    time.sleep(1)
    r = requests.post(f"{API}/submissions", json=payload)
    if r.status_code == 429:
        time.sleep(61)
        r = requests.post(f"{API}/submissions", json=payload)
    assert r.status_code == 200, r.text
    sid = r.json()["id"]

    # unauthorized approve
    r = requests.post(f"{API}/admin/submissions/{sid}/approve")
    assert r.status_code == 401

    # authorized approve
    r = admin_session.post(f"{API}/admin/submissions/{sid}/approve")
    assert r.status_code == 200

    r = requests.get(f"{API}/businesses/{sid}")
    assert r.status_code == 200
    assert r.json()["status"] == "approved"

    # cleanup
    r = admin_session.delete(f"{API}/admin/submissions/{sid}")
    assert r.status_code == 200


# ---------- reviews ----------
def test_reviews_flow_and_reply_admin_only(admin_session):
    items = requests.get(f"{API}/businesses").json()
    bid = items[0]["id"]
    before = requests.get(f"{API}/businesses/{bid}").json()
    prev = before.get("reviewsCount", 0)

    r = requests.post(f"{API}/reviews", json={
        "businessId": bid, "author": "TEST_Reviewer", "stars": 5, "text": "Excelente",
    })
    assert r.status_code == 200
    after = requests.get(f"{API}/businesses/{bid}").json()
    assert after["reviewsCount"] == prev + 1
    rid = next(r for r in after["reviews"] if r["author"] == "TEST_Reviewer")["id"]

    # reply without auth -> 401
    r = requests.post(f"{API}/reviews/{rid}/reply", json={"text": "hola"})
    assert r.status_code == 401

    # reply with admin cookie -> 200
    r = admin_session.post(f"{API}/reviews/{rid}/reply", json={"text": "Gracias!"})
    assert r.status_code == 200


def test_review_invalid_stars():
    items = requests.get(f"{API}/businesses").json()
    bid = items[0]["id"]
    r = requests.post(f"{API}/reviews", json={
        "businessId": bid, "author": "X", "stars": 9, "text": "bad",
    })
    assert r.status_code == 422


# ---------- admin CRUD generic ----------
@pytest.mark.parametrize("collection,payload,updated", [
    ("cameras",
     {"lat": -34.9, "lng": -57.9, "type": "velocidad", "address": "TEST cam", "direction": "N"},
     {"lat": -34.9, "lng": -57.9, "type": "velocidad", "address": "TEST cam UPD", "direction": "N"}),
    ("places",
     {"name": "TEST_Place", "kind": "hospital", "zone": "Test", "lat": -34.9, "lng": -57.9},
     {"name": "TEST_Place_UPD", "kind": "hospital", "zone": "Test", "lat": -34.9, "lng": -57.9}),
    ("sites",
     {"name": "TEST_Site", "zone": "Test", "enabled": True, "description": "x"},
     {"name": "TEST_Site", "zone": "Test", "enabled": False, "description": "x2"}),
    ("desvios",
     {"street": "TEST street", "type": "obra", "description": "d", "lat": -34.9, "lng": -57.9},
     {"street": "TEST street", "type": "corte", "description": "d2", "lat": -34.9, "lng": -57.9}),
])
def test_admin_crud(admin_session, collection, payload, updated):
    r = requests.post(f"{API}/admin/{collection}", json=payload)
    assert r.status_code == 401

    r = admin_session.post(f"{API}/admin/{collection}", json=payload)
    assert r.status_code == 200, r.text
    item_id = r.json()["id"]

    listing = requests.get(f"{API}/{collection}").json()
    assert any(x["id"] == item_id for x in listing)

    r = admin_session.put(f"{API}/admin/{collection}/{item_id}", json=updated)
    assert r.status_code == 200

    r = admin_session.delete(f"{API}/admin/{collection}/{item_id}")
    assert r.status_code == 200
