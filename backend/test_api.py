#!/usr/bin/env python3
"""
Simple test script to verify the Flask API is working correctly
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    print("🏥 Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code == 200

def test_generate_plan():
    print("\n🚀 Testing plan generation...")
    data = {
        "present_weight": 75,
        "expected_weight": 70,
        "target_months": 6
    }
    response = requests.post(f"{BASE_URL}/generate-plan", json=data)
    print(f"Status: {response.status_code}")
    if response.status_code == 201:
        result = response.json()
        print(f"Plan ID: {result['plan_id']}")
        print(f"Success: {result['success']}")
        return result['plan_id']
    else:
        print(f"Error: {response.json()}")
        return None

def test_get_plans():
    print("\n📋 Testing get all plans...")
    response = requests.get(f"{BASE_URL}/plans")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"Total plans: {result['pagination']['total']}")
        print(f"Plans returned: {len(result['plans'])}")
        return True
    else:
        print(f"Error: {response.json()}")
        return False

def main():
    print("🧪 Testing Flask API Endpoints\n")
    
    # Test health
    health_ok = test_health()
    
    # Test plan generation
    plan_id = test_generate_plan()
    
    # Test get plans
    plans_ok = test_get_plans()
    
    print(f"\n📊 Test Results:")
    print(f"Health Check: {'✅ PASS' if health_ok else '❌ FAIL'}")
    print(f"Plan Generation: {'✅ PASS' if plan_id else '❌ FAIL'}")
    print(f"Get Plans: {'✅ PASS' if plans_ok else '❌ FAIL'}")
    
    if health_ok and plan_id and plans_ok:
        print("\n🎉 All tests passed! Backend is working correctly.")
    else:
        print("\n⚠️ Some tests failed. Check the backend logs.")

if __name__ == "__main__":
    main()
