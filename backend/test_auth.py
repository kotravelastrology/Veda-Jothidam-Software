#!/usr/bin/env python
"""Test script for authentication endpoints."""

import sys
sys.path.insert(0, '.')

from app import create_app
from database import db
from models import User
import json

app = create_app()
client = app.test_client()

print("[TEST] Authentication Endpoint Tests\n")
print("=" * 60)

# Test 1: Health Check
print("\n1. Testing Health Check Endpoint")
response = client.get('/api/health')
print(f"   Status: {response.status_code}")
print(f"   Response: {response.get_json()}")
assert response.status_code == 200, "Health check failed"
print("   [PASS]")

# Test 2: Signup
print("\n2. Testing Signup Endpoint")
signup_data = {
    'email': 'test@example.com',
    'password': 'TestPassword123!',
    'name': 'Test User',
    'language': 'Tamil',
    'timezone': 'Asia/Kolkata'
}
response = client.post('/api/auth/signup',
                       data=json.dumps(signup_data),
                       content_type='application/json')
print(f"   Status: {response.status_code}")
result = response.get_json()
print(f"   User Created: {result.get('user', {}).get('email')}")
print(f"   Token Generated: {'access_token' in result}")
assert response.status_code == 201, "Signup failed"
assert 'access_token' in result, "No token generated"
token = result['access_token']
print("   [PASS]")

# Test 3: Duplicate Email
print("\n3. Testing Duplicate Email Prevention")
response = client.post('/api/auth/signup',
                       data=json.dumps(signup_data),
                       content_type='application/json')
print(f"   Status: {response.status_code}")
print(f"   Error: {response.get_json().get('error')}")
assert response.status_code == 409, "Should reject duplicate email"
print("   [PASS]")

# Test 4: Login
print("\n4. Testing Login Endpoint")
login_data = {
    'email': 'test@example.com',
    'password': 'TestPassword123!'
}
response = client.post('/api/auth/login',
                       data=json.dumps(login_data),
                       content_type='application/json')
print(f"   Status: {response.status_code}")
result = response.get_json()
print(f"   Login Success: {result.get('message')}")
print(f"   Token Generated: {'access_token' in result}")
assert response.status_code == 200, "Login failed"
assert 'access_token' in result, "No token generated"
token = result['access_token']
print("   [PASS]")

# Test 5: Invalid Login
print("\n5. Testing Invalid Credentials")
bad_login = {
    'email': 'test@example.com',
    'password': 'WrongPassword'
}
response = client.post('/api/auth/login',
                       data=json.dumps(bad_login),
                       content_type='application/json')
print(f"   Status: {response.status_code}")
print(f"   Error: {response.get_json().get('error')}")
assert response.status_code == 401, "Should reject invalid credentials"
print("   [PASS]")

# Test 6: Get Profile
print("\n6. Testing Get Profile Endpoint")
headers = {'Authorization': f'Bearer {token}'}
response = client.get('/api/auth/profile', headers=headers)
print(f"   Status: {response.status_code}")
result = response.get_json()
print(f"   User: {result.get('user', {}).get('name')}")
print(f"   Email: {result.get('user', {}).get('email')}")
assert response.status_code == 200, "Get profile failed"
print("   [PASS]")

# Test 7: Update Profile
print("\n7. Testing Update Profile Endpoint")
update_data = {
    'name': 'Updated User',
    'language': 'Hindi'
}
response = client.put('/api/auth/profile',
                      data=json.dumps(update_data),
                      headers={**headers, 'Content-Type': 'application/json'})
print(f"   Status: {response.status_code}")
result = response.get_json()
print(f"   Updated Name: {result.get('user', {}).get('name')}")
print(f"   Updated Language: {result.get('user', {}).get('language')}")
assert response.status_code == 200, "Update profile failed"
print("   [PASS]")

# Test 8: Change Password
print("\n8. Testing Change Password Endpoint")
password_data = {
    'old_password': 'TestPassword123!',
    'new_password': 'NewPassword456!'
}
response = client.post('/api/auth/change-password',
                       data=json.dumps(password_data),
                       headers={**headers, 'Content-Type': 'application/json'})
print(f"   Status: {response.status_code}")
print(f"   Message: {response.get_json().get('message')}")
assert response.status_code == 200, "Change password failed"
print("   [PASS]")

# Test 9: Login with New Password
print("\n9. Testing Login with New Password")
new_login = {
    'email': 'test@example.com',
    'password': 'NewPassword456!'
}
response = client.post('/api/auth/login',
                       data=json.dumps(new_login),
                       content_type='application/json')
print(f"   Status: {response.status_code}")
print(f"   Login Success: {response.status_code == 200}")
assert response.status_code == 200, "Login with new password failed"
print("   [PASS]")

# Test 10: Missing Authorization Header
print("\n10. Testing Missing Authorization Header")
response = client.get('/api/auth/profile')
print(f"   Status: {response.status_code}")
print(f"   Error: {response.get_json().get('msg')}")
assert response.status_code == 401, "Should reject missing token"
print("   [PASS]")

print("\n" + "=" * 60)
print("[OK] All 10 authentication tests passed!")
print("=" * 60)
