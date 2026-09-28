"""CSRF header defense tests for admin write endpoints (iteration 2)."""
import os
import pytest
import requests
from dotenv import load_dotenv

load_dotenv("/app/frontend/.env")
BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
API = f"{BASE_URL}/api"
ADMIN_EMAIL = "admin@automotoslp.com"
ADMIN_PASSWORD = "AutoMotosLP.2026!"

XRW = {"X-Requested-With": "XMLHttpRequest"}


@pytest.fixture(scope="module")
def admin_session():
    s = requests.Session()
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, headers=XRW, timeout=15)
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    return s


@pytest.fixture(scope="module")
def no_xrw_session(admin_session):
    """A cloned session WITHOUT X-Requested-With header (uses same cookies)."""
    s = requests.Session()
    s.cookies.update(admin_session.cookies)
    return s


# ---------- Auth basics ----------
def test_login_wrong_password_returns_401():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong-pass-xyz"}, headers=XRW, timeout=15)
    assert r.status_code == 401


def test_admin_endpoint_without_cookie_returns_401():
    r = requests.get(f"{API}/admin/submissions", headers=XRW, timeout=15)
    assert r.status_code == 401


# ---------- GETs should NOT require X-Requested-With ----------
def test_admin_submissions_get_ok(admin_session):
    r = admin_session.get(f"{API}/admin/submissions", headers=XRW, timeout=15)
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_admin_submissions_get_without_xrw_also_ok(no_xrw_session):
    # GET should not be blocked by CSRF header requirement
    r = no_xrw_session.get(f"{API}/admin/submissions", timeout=15)
    assert r.status_code == 200


# ---------- CSRF: writes WITHOUT header -> 403 ----------
def test_verify_business_without_xrw_returns_403(no_xrw_session):
    # Use any id; endpoint should reject on CSRF check BEFORE touching DB
    r = no_xrw_session.post(f"{API}/admin/businesses/000000000000000000000000/verify", timeout=15)
    assert r.status_code == 403, f"expected 403 without X-Requested-With, got {r.status_code} {r.text}"


def test_crud_add_without_xrw_returns_403(no_xrw_session):
    r = no_xrw_session.post(f"{API}/admin/cameras", json={"lat": -34.9, "lng": -57.9, "type": "test", "address": "TEST_addr"}, timeout=15)
    assert r.status_code == 403


def test_approve_submission_without_xrw_returns_403(no_xrw_session):
    r = no_xrw_session.post(f"{API}/admin/submissions/nonexistent/approve", timeout=15)
    assert r.status_code == 403


def test_delete_submission_without_xrw_returns_403(no_xrw_session):
    r = no_xrw_session.delete(f"{API}/admin/submissions/nonexistent", timeout=15)
    assert r.status_code == 403


def test_reply_review_without_xrw_returns_403(no_xrw_session):
    r = no_xrw_session.post(f"{API}/reviews/nonexistent/reply", json={"text": "hi"}, timeout=15)
    assert r.status_code == 403


# ---------- CSRF: writes WITH header -> succeed / normal 404 ----------
def test_verify_business_with_xrw_works(admin_session):
    # nonexistent id -> expect 404, NOT 403
    r = admin_session.post(f"{API}/admin/businesses/000000000000000000000000/verify", headers=XRW, timeout=15)
    assert r.status_code in (200, 404), f"got {r.status_code} {r.text}"


def test_crud_add_and_delete_camera_with_xrw(admin_session):
    payload = {"lat": -34.9214, "lng": -57.9544, "type": "test", "address": "TEST_csrf_addr", "direction": "N"}
    r = admin_session.post(f"{API}/admin/cameras", json=payload, headers=XRW, timeout=15)
    assert r.status_code == 200, f"create failed: {r.status_code} {r.text}"
    data = r.json()
    cid = data.get("id") or data.get("_id")
    assert cid, f"no id in response: {data}"

    # verify GET
    r = requests.get(f"{API}/cameras", timeout=15)
    assert r.status_code == 200
    ids = [c.get("id") for c in r.json()]
    assert cid in ids

    # cleanup delete
    r = admin_session.delete(f"{API}/admin/cameras/{cid}", headers=XRW, timeout=15)
    assert r.status_code == 200

    r = requests.get(f"{API}/cameras", timeout=15)
    assert cid not in [c.get("id") for c in r.json()]


def test_crud_add_and_delete_site_with_xrw(admin_session):
    payload = {"name": "TEST_csrf_site", "zone": "centro", "enabled": True, "description": "test"}
    r = admin_session.post(f"{API}/admin/sites", json=payload, headers=XRW, timeout=15)
    assert r.status_code == 200
    sid = r.json().get("id")
    assert sid
    r = admin_session.delete(f"{API}/admin/sites/{sid}", headers=XRW, timeout=15)
    assert r.status_code == 200


def test_crud_add_and_delete_desvio_with_xrw(admin_session):
    payload = {"street": "TEST_csrf_desvio", "type": "corte", "description": "x"}
    r = admin_session.post(f"{API}/admin/desvios", json=payload, headers=XRW, timeout=15)
    assert r.status_code == 200
    did = r.json().get("id")
    assert did
    r = admin_session.delete(f"{API}/admin/desvios/{did}", headers=XRW, timeout=15)
    assert r.status_code == 200


# ---------- Public flows are NOT affected by CSRF header ----------
def test_public_submission_without_xrw_works():
    payload = {
        "name": "TEST_csrf_taller",
        "phone": "+542211234567",
        "address": "Calle 1 123",
        "zone": "centro",
        "vehicles": ["auto"],
        "services": ["mecánica"], "category": "mecanica", "whatsapp": "5492211234567",
    }
    r = requests.post(f"{API}/submissions", json=payload, timeout=15)
    assert r.status_code == 200, f"public submission failed: {r.status_code} {r.text}"


def test_public_review_without_xrw_works():
    # need a business id first
    r = requests.get(f"{API}/businesses", timeout=15)
    assert r.status_code == 200
    lst = r.json()
    if not lst:
        pytest.skip("no businesses seeded")
    bid = lst[0].get("id")
    payload = {"businessId": bid, "author": "TEST_csrf_user", "stars": 5, "text": "buen taller"}
    r = requests.post(f"{API}/reviews", json=payload, timeout=15)
    assert r.status_code == 200, f"public review failed: {r.status_code} {r.text}"


# ---------- Approve/Reject full flow with XRW ----------
def test_admin_approve_submission_flow(admin_session):
    # create pending
    payload = {
        "name": "TEST_csrf_pending",
        "phone": "+542211111111",
        "address": "Calle 9 999",
        "zone": "centro",
        "vehicles": ["auto", "moto"],
        "services": ["chapa"], "category": "chapa", "whatsapp": "5492211111111",
    }
    r = requests.post(f"{API}/submissions", json=payload, timeout=15)
    assert r.status_code == 200
    sid = r.json().get("id")
    assert sid
    # approve
    r = admin_session.post(f"{API}/admin/submissions/{sid}/approve", headers=XRW, timeout=15)
    assert r.status_code == 200, f"approve failed: {r.status_code} {r.text}"


def test_admin_reject_submission_flow(admin_session):
    payload = {
        "name": "TEST_csrf_pending_reject",
        "phone": "+542212222222",
        "address": "Calle 8 888",
        "zone": "sur",
        "vehicles": ["moto"],
        "services": ["mecánica"], "category": "mecanica", "whatsapp": "5492211234567",
    }
    r = requests.post(f"{API}/submissions", json=payload, timeout=15)
    assert r.status_code == 200
    sid = r.json().get("id")
    r = admin_session.delete(f"{API}/admin/submissions/{sid}", headers=XRW, timeout=15)
    assert r.status_code == 200
