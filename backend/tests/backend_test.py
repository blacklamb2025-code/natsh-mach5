"""Backend API tests for AUTOMOTOS L.P."""
import os
import pytest
import requests

BASE = os.environ.get("REACT_APP_BACKEND_URL")
if not BASE:
    # fallback to reading frontend .env
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE = line.split("=", 1)[1].strip()
BASE = BASE.rstrip("/")
API = f"{BASE}/api"
ADMIN_TOKEN = "recolp-admin-2025"
ADMIN_HDR = {"X-Admin-Token": ADMIN_TOKEN}


# ---------- root & basic ----------
def test_root():
    r = requests.get(f"{API}/")
    assert r.status_code == 200
    j = r.json()
    assert j["message"] == "AUTOMOTOS L.P. API"
    assert j["status"] == "ok"


# ---------- businesses ----------
def test_businesses_list():
    r = requests.get(f"{API}/businesses")
    assert r.status_code == 200
    items = r.json()
    assert isinstance(items, list) and len(items) > 0
    assert all(b.get("status") == "approved" for b in items)
    assert all("verified" in b for b in items)


def test_businesses_filter_vehicle_auto():
    r = requests.get(f"{API}/businesses", params={"vehicle": "auto"})
    assert r.status_code == 200
    items = r.json()
    assert all("auto" in b.get("vehicles", []) for b in items)


def test_businesses_filter_vehicle_moto():
    r = requests.get(f"{API}/businesses", params={"vehicle": "moto"})
    assert r.status_code == 200
    for b in r.json():
        assert "moto" in b["vehicles"]


def test_businesses_filter_category():
    r = requests.get(f"{API}/businesses", params={"category": "mecanica"})
    assert r.status_code == 200
    for b in r.json():
        assert b["category"] == "mecanica"


def test_business_detail_has_reviews_and_verified():
    items = requests.get(f"{API}/businesses").json()
    bid = items[0]["id"]
    r = requests.get(f"{API}/businesses/{bid}")
    assert r.status_code == 200
    b = r.json()
    assert b["id"] == bid
    assert "reviews" in b and isinstance(b["reviews"], list)
    assert "verified" in b


def test_business_detail_404():
    r = requests.get(f"{API}/businesses/nonexistent-id")
    assert r.status_code == 404


# ---------- search ----------
def test_search_accent_insensitive_mecanica():
    r = requests.get(f"{API}/search", params={"q": "mecanica"})
    assert r.status_code == 200
    items = r.json()
    assert len(items) > 0
    # Should find businesses in mecanica category
    assert any(b["category"] == "mecanica" for b in items)


def test_search_by_zone_city_bell():
    r = requests.get(f"{API}/search", params={"q": "City Bell"})
    assert r.status_code == 200
    items = r.json()
    assert len(items) > 0
    assert any("City Bell" in b.get("zone", "") for b in items)


def test_search_empty_returns_all():
    r = requests.get(f"{API}/search", params={"q": ""})
    assert r.status_code == 200
    assert len(r.json()) > 0


# ---------- submissions + admin flow ----------
def test_submission_admin_flow():
    payload = {
        "name": "TEST_Submission_Workshop",
        "category": "mecanica",
        "vehicles": ["auto"],
        "zone": "Casco Urbano",
        "whatsapp": "5492219999999",
        "description": "Test submission",
        "services": ["Test"],
    }
    r = requests.post(f"{API}/submissions", json=payload)
    assert r.status_code == 200
    sid = r.json()["id"]

    # Admin lists pending - should include ours
    r = requests.get(f"{API}/admin/submissions", headers=ADMIN_HDR)
    assert r.status_code == 200
    ids = [s["id"] for s in r.json()]
    assert sid in ids

    # Unauthorized
    r = requests.get(f"{API}/admin/submissions")
    assert r.status_code == 401
    r = requests.get(f"{API}/admin/submissions", headers={"X-Admin-Token": "bad"})
    assert r.status_code == 401

    # Approve
    r = requests.post(f"{API}/admin/submissions/{sid}/approve", headers=ADMIN_HDR)
    assert r.status_code == 200

    # Verify approved via public GET
    r = requests.get(f"{API}/businesses/{sid}")
    assert r.status_code == 200
    assert r.json()["status"] == "approved"

    # Delete (cleanup)
    r = requests.delete(f"{API}/admin/submissions/{sid}", headers=ADMIN_HDR)
    assert r.status_code == 200
    r = requests.get(f"{API}/businesses/{sid}")
    assert r.status_code == 404


# ---------- reviews ----------
def test_reviews_flow():
    items = requests.get(f"{API}/businesses").json()
    bid = items[0]["id"]
    before = requests.get(f"{API}/businesses/{bid}").json()
    prev_count = before.get("reviewsCount", 0)

    r = requests.post(f"{API}/reviews", json={
        "businessId": bid, "author": "TEST_User", "stars": 5, "text": "Excelente"
    })
    assert r.status_code == 200

    after = requests.get(f"{API}/businesses/{bid}").json()
    assert after["reviewsCount"] == prev_count + 1
    assert len(after["reviews"]) >= 1
    new_review = next(rv for rv in after["reviews"] if rv["author"] == "TEST_User")
    rid = new_review["id"]

    # Reply
    r = requests.post(f"{API}/reviews/{rid}/reply", json={"text": "Gracias!"})
    assert r.status_code == 200
    after2 = requests.get(f"{API}/businesses/{bid}").json()
    rv = next(x for x in after2["reviews"] if x["id"] == rid)
    assert rv["reply"] is not None
    assert rv["reply"]["text"] == "Gracias!"


# ---------- seeded collections ----------
@pytest.mark.parametrize("endpoint,expected_min", [
    ("radars", 10),
    ("fuel-points", 8),
    ("cameras", 8),
    ("events", 4),
    ("places", 4),
    ("sites", 4),
    ("desvios", 4),
])
def test_seeded_collections(endpoint, expected_min):
    r = requests.get(f"{API}/{endpoint}")
    assert r.status_code == 200
    items = r.json()
    assert len(items) >= expected_min, f"{endpoint}: got {len(items)}, expected >= {expected_min}"


def test_create_community_radar():
    r = requests.post(f"{API}/radars", json={
        "lat": -34.92, "lng": -57.95, "type": "movil", "description": "TEST radar"
    })
    assert r.status_code == 200
    d = r.json()
    assert d["community"] is True
    assert "id" in d


# ---------- admin CRUD generic (cameras/places/sites/desvios) ----------
@pytest.mark.parametrize("collection,payload,updated", [
    ("cameras",
     {"lat": -34.9, "lng": -57.9, "type": "velocidad", "address": "TEST cam", "direction": "N"},
     {"lat": -34.9, "lng": -57.9, "type": "velocidad", "address": "TEST cam UPDATED", "direction": "N"}),
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
def test_admin_crud(collection, payload, updated):
    # Unauthorized create
    r = requests.post(f"{API}/admin/{collection}", json=payload)
    assert r.status_code == 401

    # Create
    r = requests.post(f"{API}/admin/{collection}", json=payload, headers=ADMIN_HDR)
    assert r.status_code == 200, r.text
    item_id = r.json()["id"]

    # Verify persisted via public GET
    listing = requests.get(f"{API}/{collection}").json()
    assert any(x["id"] == item_id for x in listing)

    # Update
    r = requests.put(f"{API}/admin/{collection}/{item_id}", json=updated, headers=ADMIN_HDR)
    assert r.status_code == 200

    listing = requests.get(f"{API}/{collection}").json()
    updated_item = next(x for x in listing if x["id"] == item_id)
    for k, v in updated.items():
        assert updated_item[k] == v, f"{k}: {updated_item[k]} != {v}"

    # Delete
    r = requests.delete(f"{API}/admin/{collection}/{item_id}", headers=ADMIN_HDR)
    assert r.status_code == 200
    listing = requests.get(f"{API}/{collection}").json()
    assert not any(x["id"] == item_id for x in listing)


def test_admin_verify_endpoint():
    r = requests.get(f"{API}/admin/verify", headers=ADMIN_HDR)
    assert r.status_code == 200
    r = requests.get(f"{API}/admin/verify", headers={"X-Admin-Token": "bad"})
    assert r.status_code == 401
