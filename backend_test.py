#!/usr/bin/env python3
"""
Backend API Test Suite for Aanya Home Healthcare
Tests all critical endpoints as specified in the review request
"""

import requests
import json
import time
from datetime import datetime

# Base URL from .env
BASE_URL = "https://home-nurse-ai.preview.emergentagent.com/api"

def print_test(name, passed, details=""):
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"\n{status}: {name}")
    if details:
        print(f"  Details: {details}")

def test_health():
    """Test 1: GET /api/health"""
    try:
        resp = requests.get(f"{BASE_URL}/health", timeout=10)
        data = resp.json()
        passed = (
            resp.status_code == 200 and
            data.get("status") == "ok" and
            "service" in data and
            "time" in data
        )
        print_test("GET /api/health", passed, f"Status: {resp.status_code}, Response: {json.dumps(data, indent=2)}")
        return passed
    except Exception as e:
        print_test("GET /api/health", False, f"Exception: {str(e)}")
        return False

def test_leads_create():
    """Test 2: POST /api/leads - Create a lead"""
    try:
        payload = {
            "name": "Rajesh Kumar",
            "phone": "9876543210",
            "email": "rajesh.kumar@example.com",
            "service": "Home Nursing",
            "city": "Pune",
            "note": "Need ICU setup for elderly parent"
        }
        resp = requests.post(f"{BASE_URL}/leads", json=payload, timeout=10)
        data = resp.json()
        passed = (
            resp.status_code == 200 and
            data.get("ok") == True and
            "lead" in data and
            data["lead"].get("id") and
            data["lead"].get("name") == payload["name"]
        )
        lead_id = data.get("lead", {}).get("id")
        print_test("POST /api/leads (create)", passed, f"Status: {resp.status_code}, Lead ID: {lead_id}")
        return passed, lead_id
    except Exception as e:
        print_test("POST /api/leads (create)", False, f"Exception: {str(e)}")
        return False, None

def test_leads_get():
    """Test 3: GET /api/leads - Retrieve leads"""
    try:
        resp = requests.get(f"{BASE_URL}/leads", timeout=10)
        data = resp.json()
        passed = (
            resp.status_code == 200 and
            "leads" in data and
            isinstance(data["leads"], list)
        )
        count = len(data.get("leads", []))
        print_test("GET /api/leads", passed, f"Status: {resp.status_code}, Leads count: {count}")
        return passed
    except Exception as e:
        print_test("GET /api/leads", False, f"Exception: {str(e)}")
        return False

def test_leads_update(lead_id):
    """Test 4: PATCH /api/leads/{id} - Update lead status"""
    if not lead_id:
        print_test("PATCH /api/leads/{id}", False, "No lead_id provided from create test")
        return False
    
    try:
        payload = {"status": "contacted"}
        resp = requests.patch(f"{BASE_URL}/leads/{lead_id}", json=payload, timeout=10)
        data = resp.json()
        passed = resp.status_code == 200 and data.get("ok") == True
        
        # Verify the update by fetching leads
        if passed:
            time.sleep(0.5)  # Small delay to ensure DB update
            get_resp = requests.get(f"{BASE_URL}/leads", timeout=10)
            leads = get_resp.json().get("leads", [])
            updated_lead = next((l for l in leads if l.get("id") == lead_id), None)
            if updated_lead:
                passed = updated_lead.get("status") == "contacted"
                print_test("PATCH /api/leads/{id}", passed, f"Status: {resp.status_code}, Updated status verified: {updated_lead.get('status')}")
            else:
                print_test("PATCH /api/leads/{id}", False, "Lead not found after update")
        else:
            print_test("PATCH /api/leads/{id}", passed, f"Status: {resp.status_code}, Response: {data}")
        
        return passed
    except Exception as e:
        print_test("PATCH /api/leads/{id}", False, f"Exception: {str(e)}")
        return False

def test_kpis():
    """Test 5: GET /api/kpis - Mock KPI dashboard"""
    try:
        resp = requests.get(f"{BASE_URL}/kpis", timeout=10)
        data = resp.json()
        passed = (
            resp.status_code == 200 and
            "summary" in data and
            "series" in data and
            "topKeywords" in data and
            "topPages" in data and
            "totalLeads" in data["summary"] and
            "googleAdsSpend" in data["summary"] and
            "gbpCalls" in data["summary"] and
            "ga4Sessions" in data["summary"] and
            len(data["series"]) == 30
        )
        print_test("GET /api/kpis", passed, f"Status: {resp.status_code}, Series length: {len(data.get('series', []))}, Total leads: {data.get('summary', {}).get('totalLeads')}")
        return passed
    except Exception as e:
        print_test("GET /api/kpis", False, f"Exception: {str(e)}")
        return False

def test_chat_single():
    """Test 6a: POST /api/chat - Single message"""
    try:
        payload = {
            "session_id": "test-session-backend-1",
            "message": "What is home nursing and how much does it cost?"
        }
        resp = requests.post(f"{BASE_URL}/chat", json=payload, timeout=35)
        data = resp.json()
        passed = (
            resp.status_code == 200 and
            "response" in data and
            "session_id" in data and
            len(data["response"]) > 10
        )
        response_preview = data.get("response", "")[:100] + "..." if len(data.get("response", "")) > 100 else data.get("response", "")
        print_test("POST /api/chat (single message)", passed, f"Status: {resp.status_code}, Response preview: {response_preview}")
        return passed
    except Exception as e:
        print_test("POST /api/chat (single message)", False, f"Exception: {str(e)}")
        return False

def test_chat_session_continuity():
    """Test 6b: POST /api/chat - Session continuity"""
    try:
        session_id = f"test-session-continuity-{int(time.time())}"
        
        # First message
        payload1 = {
            "session_id": session_id,
            "message": "I need physiotherapy services in Mumbai"
        }
        resp1 = requests.post(f"{BASE_URL}/chat", json=payload1, timeout=35)
        data1 = resp1.json()
        
        time.sleep(1)
        
        # Second message in same session
        payload2 = {
            "session_id": session_id,
            "message": "What are the charges?"
        }
        resp2 = requests.post(f"{BASE_URL}/chat", json=payload2, timeout=35)
        data2 = resp2.json()
        
        passed = (
            resp1.status_code == 200 and
            resp2.status_code == 200 and
            data1.get("session_id") == session_id and
            data2.get("session_id") == session_id and
            "response" in data1 and
            "response" in data2
        )
        print_test("POST /api/chat (session continuity)", passed, f"Session ID: {session_id}, Both responses received")
        return passed
    except Exception as e:
        print_test("POST /api/chat (session continuity)", False, f"Exception: {str(e)}")
        return False

def test_generate_content():
    """Test 7: POST /api/generate-content"""
    try:
        payload = {
            "type": "blog",
            "topic": "Benefits of home physiotherapy for seniors",
            "tone": "warm",
            "length": "short",
            "city": "Mumbai",
            "service": "Physiotherapy"
        }
        resp = requests.post(f"{BASE_URL}/generate-content", json=payload, timeout=35)
        data = resp.json()
        passed = (
            resp.status_code == 200 and
            "output" in data and
            len(data["output"]) > 100
        )
        output_preview = data.get("output", "")[:150] + "..." if len(data.get("output", "")) > 150 else data.get("output", "")
        print_test("POST /api/generate-content", passed, f"Status: {resp.status_code}, Output length: {len(data.get('output', ''))}, Preview: {output_preview}")
        return passed
    except Exception as e:
        print_test("POST /api/generate-content", False, f"Exception: {str(e)}")
        return False

def test_blog_create():
    """Test 8: POST /api/blog - Create blog post"""
    try:
        payload = {
            "title": "Understanding Home Healthcare Services in India",
            "content": "# Introduction\n\nHome healthcare is becoming increasingly popular...\n\n## Benefits\n\n- Comfort of home\n- Personalized care\n- Cost-effective",
            "excerpt": "A comprehensive guide to home healthcare services",
            "tags": ["test", "healthcare", "home-nursing"],
            "published": True
        }
        resp = requests.post(f"{BASE_URL}/blog", json=payload, timeout=10)
        data = resp.json()
        passed = (
            resp.status_code == 200 and
            data.get("ok") == True and
            "post" in data and
            data["post"].get("slug") and
            data["post"].get("title") == payload["title"]
        )
        slug = data.get("post", {}).get("slug")
        print_test("POST /api/blog", passed, f"Status: {resp.status_code}, Slug: {slug}")
        return passed, slug
    except Exception as e:
        print_test("POST /api/blog", False, f"Exception: {str(e)}")
        return False, None

def test_blog_get():
    """Test 9: GET /api/blog - Retrieve blog posts"""
    try:
        resp = requests.get(f"{BASE_URL}/blog", timeout=10)
        data = resp.json()
        passed = (
            resp.status_code == 200 and
            "posts" in data and
            isinstance(data["posts"], list)
        )
        count = len(data.get("posts", []))
        print_test("GET /api/blog", passed, f"Status: {resp.status_code}, Posts count: {count}")
        return passed
    except Exception as e:
        print_test("GET /api/blog", False, f"Exception: {str(e)}")
        return False

def test_careers_create():
    """Test 10: POST /api/careers - Submit application"""
    try:
        payload = {
            "name": "Priya Sharma",
            "phone": "9123456789",
            "email": "priya.sharma@example.com",
            "role": "Registered Nurse",
            "experience": "5 years in ICU care",
            "message": "Looking for home healthcare opportunities"
        }
        resp = requests.post(f"{BASE_URL}/careers", json=payload, timeout=10)
        data = resp.json()
        passed = resp.status_code == 200 and data.get("ok") == True
        print_test("POST /api/careers", passed, f"Status: {resp.status_code}, Response: {data}")
        return passed
    except Exception as e:
        print_test("POST /api/careers", False, f"Exception: {str(e)}")
        return False

def test_careers_get():
    """Test 11: GET /api/careers - Retrieve applications"""
    try:
        resp = requests.get(f"{BASE_URL}/careers", timeout=10)
        data = resp.json()
        passed = (
            resp.status_code == 200 and
            "applications" in data and
            isinstance(data["applications"], list)
        )
        count = len(data.get("applications", []))
        print_test("GET /api/careers", passed, f"Status: {resp.status_code}, Applications count: {count}")
        return passed
    except Exception as e:
        print_test("GET /api/careers", False, f"Exception: {str(e)}")
        return False

def test_staff_create():
    """Test 12: POST /api/staff - Add staff member"""
    try:
        payload = {
            "name": "Amit Patel",
            "role": "Nurse",
            "city": "Pune",
            "phone": "9988776655"
        }
        resp = requests.post(f"{BASE_URL}/staff", json=payload, timeout=10)
        data = resp.json()
        passed = (
            resp.status_code == 200 and
            data.get("ok") == True and
            "staff" in data
        )
        staff_id = data.get("staff", {}).get("id")
        print_test("POST /api/staff", passed, f"Status: {resp.status_code}, Staff ID: {staff_id}")
        return passed
    except Exception as e:
        print_test("POST /api/staff", False, f"Exception: {str(e)}")
        return False

def test_staff_get():
    """Test 13: GET /api/staff - Retrieve staff list"""
    try:
        resp = requests.get(f"{BASE_URL}/staff", timeout=10)
        data = resp.json()
        passed = (
            resp.status_code == 200 and
            "staff" in data and
            isinstance(data["staff"], list)
        )
        count = len(data.get("staff", []))
        print_test("GET /api/staff", passed, f"Status: {resp.status_code}, Staff count: {count}")
        return passed
    except Exception as e:
        print_test("GET /api/staff", False, f"Exception: {str(e)}")
        return False

def test_meta():
    """Test 14: GET /api/meta - Retrieve services and cities metadata"""
    try:
        resp = requests.get(f"{BASE_URL}/meta", timeout=10)
        data = resp.json()
        passed = (
            resp.status_code == 200 and
            "services" in data and
            "cities" in data and
            isinstance(data["services"], list) and
            isinstance(data["cities"], list) and
            len(data["services"]) > 0 and
            len(data["cities"]) > 0
        )
        services_count = len(data.get("services", []))
        cities_count = len(data.get("cities", []))
        print_test("GET /api/meta", passed, f"Status: {resp.status_code}, Services: {services_count}, Cities: {cities_count}")
        return passed
    except Exception as e:
        print_test("GET /api/meta", False, f"Exception: {str(e)}")
        return False

def main():
    print("=" * 80)
    print("AANYA HOME HEALTHCARE - BACKEND API TEST SUITE")
    print("=" * 80)
    print(f"Base URL: {BASE_URL}")
    print(f"Test started at: {datetime.now().isoformat()}")
    print("=" * 80)
    
    results = {}
    
    # Test 1: Health check
    results["health"] = test_health()
    
    # Test 2-4: Leads (create, get, update)
    lead_created, lead_id = test_leads_create()
    results["leads_create"] = lead_created
    results["leads_get"] = test_leads_get()
    results["leads_update"] = test_leads_update(lead_id)
    
    # Test 5: KPIs
    results["kpis"] = test_kpis()
    
    # Test 6: Chat (single message and session continuity)
    results["chat_single"] = test_chat_single()
    results["chat_session"] = test_chat_session_continuity()
    
    # Test 7: Content generation
    results["generate_content"] = test_generate_content()
    
    # Test 8-9: Blog (create, get)
    blog_created, blog_slug = test_blog_create()
    results["blog_create"] = blog_created
    results["blog_get"] = test_blog_get()
    
    # Test 10-11: Careers (create, get)
    results["careers_create"] = test_careers_create()
    results["careers_get"] = test_careers_get()
    
    # Test 12-13: Staff (create, get)
    results["staff_create"] = test_staff_create()
    results["staff_get"] = test_staff_get()
    
    # Test 14: Meta
    results["meta"] = test_meta()
    
    # Summary
    print("\n" + "=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    print(f"Total: {passed}/{total} tests passed")
    print("\nDetailed Results:")
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {status}: {test_name}")
    
    print("\n" + "=" * 80)
    print(f"Test completed at: {datetime.now().isoformat()}")
    print("=" * 80)
    
    return passed == total

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
