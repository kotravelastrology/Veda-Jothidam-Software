#!/usr/bin/env python
"""Test script for chart endpoints."""

import sys
sys.path.insert(0, '.')

from backend.app import create_app
from backend.database import db
from backend.models import User, Chart, PhaseData
import json
from datetime import datetime

app = create_app()
client = app.test_client()

print("[TEST] Chart Data Storage Tests\n")
print("=" * 70)

# Setup: Create test user and get token
print("\n0. Setup: Creating test user...")
signup_data = {
    'email': 'charttest@example.com',
    'password': 'ChartTest123!',
    'name': 'Chart Tester'
}
response = client.post('/api/auth/signup',
                       data=json.dumps(signup_data),
                       content_type='application/json')
result = response.get_json()
token = result['access_token']
headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
print(f"   [OK] User created, token obtained")

# Test 1: Create Chart
print("\n1. Testing Create Chart Endpoint")
chart_data = {
    'name': 'Ram Kumar',
    'birth_date': '1990-05-15',
    'birth_time': '10:30:00',
    'birth_place': 'Chennai, India',
    'latitude': 13.0827,
    'longitude': 80.2707,
    'timezone': 'Asia/Kolkata'
}
response = client.post('/api/charts/create',
                       data=json.dumps(chart_data),
                       headers=headers)
print(f"   Status: {response.status_code}")
result = response.get_json()
chart_id = result['chart']['id']
print(f"   Chart ID: {chart_id[:8]}...")
print(f"   Chart Name: {result['chart']['name']}")
assert response.status_code == 201, "Chart creation failed"
print("   [PASS]")

# Test 2: Create Second Chart
print("\n2. Testing Create Multiple Charts")
chart_data2 = {
    'name': 'Priya Sharma',
    'birth_date': '1995-08-20',
    'birth_time': '14:45:30',
    'birth_place': 'Bangalore, India',
    'latitude': 12.9716,
    'longitude': 77.5946,
    'timezone': 'Asia/Kolkata'
}
response = client.post('/api/charts/create',
                       data=json.dumps(chart_data2),
                       headers=headers)
result = response.get_json()
chart_id2 = result['chart']['id']
print(f"   Chart 2 ID: {chart_id2[:8]}...")
print(f"   Chart 2 Name: {result['chart']['name']}")
assert response.status_code == 201, "Second chart creation failed"
print("   [PASS]")

# Test 3: List Charts
print("\n3. Testing List Charts Endpoint")
response = client.get('/api/charts', headers=headers)
print(f"   Status: {response.status_code}")
result = response.get_json()
print(f"   Total charts: {result['total_count']}")
for chart in result['charts']:
    print(f"   - {chart['name']}: {chart['id'][:8]}... (Phases: {chart['phase_count']})")
assert response.status_code == 200, "List charts failed"
assert result['total_count'] == 2, "Should have 2 charts"
print("   [PASS]")

# Test 4: Save Phase 1 Data
print("\n4. Testing Save Phase Data")
phase1_data = {
    'phase_number': 1,
    'phase_name': 'Birth Chart (D1)',
    'data': {
        'sun': 30.5,
        'moon': 45.2,
        'mars': 60.1,
        'mercury': 15.8,
        'jupiter': 75.3,
        'venus': 25.4,
        'saturn': 120.6,
        'rahu': 180.0,
        'ketu': 0.0
    }
}
response = client.post(f'/api/charts/{chart_id}/save-phase',
                       data=json.dumps(phase1_data),
                       headers=headers)
print(f"   Status: {response.status_code}")
result = response.get_json()
print(f"   Phase saved: {result['phase_data']['phase_name']}")
assert response.status_code == 201, "Phase save failed"
print("   [PASS]")

# Test 5: Save Phase 2 Data
print("\n5. Testing Save Multiple Phases")
phase2_data = {
    'phase_number': 2,
    'phase_name': 'Sarvatobhadra Chakra',
    'data': {
        'strength': 85,
        'planetary_positions': [30.5, 45.2, 60.1, 15.8, 75.3, 25.4, 120.6],
        'house_analysis': {
            'house1': 'Strong',
            'house2': 'Moderate',
            'house3': 'Weak'
        }
    }
}
response = client.post(f'/api/charts/{chart_id}/save-phase',
                       data=json.dumps(phase2_data),
                       headers=headers)
print(f"   Status: {response.status_code}")
result = response.get_json()
print(f"   Phases saved: 1, 2")
assert response.status_code == 201, "Phase 2 save failed"
print("   [PASS]")

# Test 6: Get Single Phase
print("\n6. Testing Get Single Phase")
response = client.get(f'/api/charts/{chart_id}/phase/1', headers=headers)
print(f"   Status: {response.status_code}")
result = response.get_json()
phase = result['phase_data']
print(f"   Phase 1: {phase['phase_name']}")
print(f"   Sun position: {phase['data']['sun']}°")
assert response.status_code == 200, "Get phase failed"
print("   [PASS]")

# Test 7: Get All Phases
print("\n7. Testing Get All Phases")
response = client.get(f'/api/charts/{chart_id}/phases', headers=headers)
print(f"   Status: {response.status_code}")
result = response.get_json()
print(f"   Chart: {result['chart_name']}")
print(f"   Total phases: {result['total_phases']}")
for phase_key in result['phases'].keys():
    print(f"   - {phase_key}")
assert response.status_code == 200, "Get all phases failed"
print("   [PASS]")

# Test 8: Get Full Chart
print("\n8. Testing Get Full Chart")
response = client.get(f'/api/charts/{chart_id}', headers=headers)
print(f"   Status: {response.status_code}")
result = response.get_json()
print(f"   Chart: {result['chart']['name']}")
print(f"   Birth: {result['chart']['birth_date']} at {result['chart']['birth_time']}")
print(f"   Place: {result['chart']['birth_place']}")
print(f"   Phases stored: {result['phase_count']}")
assert response.status_code == 200, "Get chart failed"
print("   [PASS]")

# Test 9: Update Phase (replace existing)
print("\n9. Testing Update Phase Data")
phase1_updated = {
    'phase_number': 1,
    'phase_name': 'Birth Chart (D1) - Updated',
    'data': {
        'sun': 31.0,  # Updated value
        'moon': 45.2,
        'mars': 60.1
    }
}
response = client.post(f'/api/charts/{chart_id}/save-phase',
                       data=json.dumps(phase1_updated),
                       headers=headers)
print(f"   Status: {response.status_code}")
result = response.get_json()
print(f"   Phase updated: {result['phase_data']['phase_name']}")
print(f"   New sun value: {result['phase_data']['data']['sun']}°")
assert response.status_code == 200, "Phase update failed"
assert result['phase_data']['data']['sun'] == 31.0, "Update value not applied"
print("   [PASS]")

# Test 10: Update Chart Info
print("\n10. Testing Update Chart Info")
update_data = {
    'name': 'Ram Kumar (Updated)',
    'timezone': 'America/New_York'
}
response = client.put(f'/api/charts/{chart_id}',
                      data=json.dumps(update_data),
                      headers=headers)
print(f"   Status: {response.status_code}")
result = response.get_json()
print(f"   Chart name updated: {result['chart']['name']}")
print(f"   Timezone updated: {result['chart']['timezone']}")
assert response.status_code == 200, "Chart update failed"
print("   [PASS]")

# Test 11: Search Charts
print("\n11. Testing Search Charts")
response = client.get('/api/charts/search?q=Ram', headers=headers)
print(f"   Status: {response.status_code}")
result = response.get_json()
print(f"   Search query: '{result['query']}'")
print(f"   Results found: {result['result_count']}")
for chart in result['results']:
    print(f"   - {chart['name']}")
assert response.status_code == 200, "Search failed"
assert result['result_count'] == 1, "Search should find 1 result"
print("   [PASS]")

# Test 12: Save Phase 3-13 (Bulk Test)
print("\n12. Testing Save All 13 Phases")
phases_added = 2  # Already have 1 and 2
for phase_num in range(3, 14):
    phase_data = {
        'phase_number': phase_num,
        'phase_name': f'Phase {phase_num}',
        'data': {
            'value': phase_num * 100,
            'timestamp': datetime.utcnow().isoformat()
        }
    }
    response = client.post(f'/api/charts/{chart_id}/save-phase',
                           data=json.dumps(phase_data),
                           headers=headers)
    if response.status_code in [201, 200]:
        phases_added += 1

print(f"   Phases added: {phases_added}/13")

# Verify all phases saved
response = client.get(f'/api/charts/{chart_id}/phases', headers=headers)
result = response.get_json()
print(f"   Verified phases in database: {result['total_phases']}/13")
assert result['total_phases'] == 13, "All 13 phases should be saved"
print("   [PASS]")

# Test 13: Delete Chart
print("\n13. Testing Delete Chart")
response = client.delete(f'/api/charts/{chart_id2}', headers=headers)
print(f"   Status: {response.status_code}")
print(f"   Message: {response.get_json()['message']}")

# Verify deletion
response = client.get('/api/charts', headers=headers)
result = response.get_json()
print(f"   Remaining charts: {result['total_count']}")
assert result['total_count'] == 1, "Should have 1 chart remaining"
print("   [PASS]")

# Test 14: Access Control (Other user cannot access chart)
print("\n14. Testing Access Control")
# Create another user
signup_data2 = {
    'email': 'other@example.com',
    'password': 'Other123!',
    'name': 'Other User'
}
response = client.post('/api/auth/signup',
                       data=json.dumps(signup_data2),
                       content_type='application/json')
other_token = response.get_json()['access_token']
other_headers = {'Authorization': f'Bearer {other_token}'}

# Try to access first user's chart
response = client.get(f'/api/charts/{chart_id}', headers=other_headers)
print(f"   Status: {response.status_code}")
print(f"   Error: {response.get_json()['error']}")
assert response.status_code == 404, "Should deny access to other user's chart"
print("   [PASS]")

# Test 15: Invalid Input Validation
print("\n15. Testing Input Validation")
invalid_chart = {
    'name': 'Invalid Chart'
    # Missing required fields
}
response = client.post('/api/charts/create',
                       data=json.dumps(invalid_chart),
                       headers=headers)
print(f"   Status: {response.status_code}")
print(f"   Error: {response.get_json()['error']}")
assert response.status_code == 400, "Should reject invalid input"
print("   [PASS]")

print("\n" + "=" * 70)
print("[OK] All 15 chart tests passed!")
print("=" * 70)

# Final Statistics
print("\nFinal Database State:")
with app.app_context():
    user_count = db.session.query(User).count()
    chart_count = db.session.query(Chart).count()
    phase_count = db.session.query(PhaseData).count()

    print(f"  - Users: {user_count}")
    print(f"  - Charts: {chart_count}")
    print(f"  - Phases: {phase_count}")
    print(f"  - Avg phases per chart: {phase_count / chart_count if chart_count > 0 else 0:.1f}")
