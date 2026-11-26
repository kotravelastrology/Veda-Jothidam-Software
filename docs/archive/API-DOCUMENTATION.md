# Vedic Astrology Platform - API Documentation

**Version:** 1.0.0  
**Last Updated:** 2026-09-14  
**Base URL:** `http://localhost:5000/api` or `https://api.vedic-astrology.com/api`  
**Authentication:** Bearer Token (JWT)

---

## Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
2. [Chart Management Endpoints](#chart-management-endpoints)
3. [Calculation Endpoints](#calculation-endpoints)
4. [Error Responses](#error-responses)
5. [Rate Limiting](#rate-limiting)
6. [Security Headers](#security-headers)

---

## Authentication Endpoints

### User Signup

**Endpoint:** `POST /api/auth/signup`

**Description:** Register a new user account

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "StrongPassword123!@#",
  "name": "John Doe",
  "language": "Tamil",
  "timezone": "Asia/Kolkata"
}
```

**Parameters:**
- `email` (string, required) - User email address (RFC 5322 compliant)
- `password` (string, required) - Password (minimum 12 chars, must include uppercase, lowercase, number, special char)
- `name` (string, optional) - User's full name
- `language` (string, optional) - Preferred language (Tamil/English, default: Tamil)
- `timezone` (string, optional) - Timezone (default: Asia/Kolkata)

**Success Response (201 Created):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "name": "John Doe",
    "language": "Tamil",
    "timezone": "Asia/Kolkata",
    "created_at": "2026-09-14T10:00:00Z"
  },
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "token_type": "Bearer"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Password must be at least 12 characters long"
}
```

**Rate Limit:** 3 attempts per hour per IP

---

### User Login

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate user and receive tokens

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "StrongPassword123!@#"
}
```

**Parameters:**
- `email` (string, required) - User email address
- `password` (string, required) - User password

**Success Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "token_type": "Bearer"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Invalid email or password"
}
```

**Rate Limit:** 5 attempts per 15 minutes per IP

---

### Refresh Token

**Endpoint:** `POST /api/auth/refresh`

**Description:** Get a new access token using refresh token

**Headers:**
```
Authorization: Bearer <refresh_token>
```

**Success Response (200 OK):**
```json
{
  "message": "Token refreshed successfully",
  "access_token": "eyJhbGc...",
  "token_type": "Bearer"
}
```

---

### Get User Profile

**Endpoint:** `GET /api/auth/profile`

**Description:** Retrieve current user's profile information

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**
```json
{
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "name": "John Doe",
    "language": "Tamil",
    "timezone": "Asia/Kolkata",
    "created_at": "2026-09-14T10:00:00Z"
  }
}
```

---

### Update Profile

**Endpoint:** `PUT /api/auth/profile`

**Description:** Update user profile information

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Jane Doe",
  "language": "English",
  "timezone": "UTC"
}
```

**Allowed Fields:** `name`, `language`, `timezone`

**Success Response (200 OK):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "name": "Jane Doe",
    "language": "English",
    "timezone": "UTC"
  }
}
```

---

### Change Password

**Endpoint:** `POST /api/auth/change-password`

**Description:** Change user password

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "old_password": "OldPassword123!@#",
  "new_password": "NewPassword456!@#"
}
```

**Parameters:**
- `old_password` (string, required) - Current password
- `new_password` (string, required) - New password (must meet strength requirements)

**Success Response (200 OK):**
```json
{
  "message": "Password changed successfully"
}
```

---

### Logout

**Endpoint:** `POST /api/auth/logout`

**Description:** Logout and invalidate current token

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**
```json
{
  "message": "Logout successful"
}
```

---

## Chart Management Endpoints

### Create Chart

**Endpoint:** `POST /api/charts/create`

**Description:** Create a new birth chart for the user

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "My Birth Chart",
  "birth_date": "1990-01-15",
  "birth_time": "14:30:45",
  "birth_place": "Chennai",
  "latitude": 13.0827,
  "longitude": 80.2707,
  "timezone": "Asia/Kolkata"
}
```

**Parameters:**
- `name` (string, required) - Chart name (1-100 characters)
- `birth_date` (string, required) - Birth date in YYYY-MM-DD format
- `birth_time` (string, required) - Birth time in HH:MM:SS format
- `birth_place` (string, required) - Birth location (2-100 characters)
- `latitude` (number, required) - Latitude (-90 to 90)
- `longitude` (number, required) - Longitude (-180 to 180)
- `timezone` (string, optional) - Timezone (default: Asia/Kolkata)

**Success Response (201 Created):**
```json
{
  "message": "Chart created successfully",
  "chart": {
    "id": "chart-uuid-here",
    "user_id": "user-uuid-here",
    "name": "My Birth Chart",
    "birth_date": "1990-01-15",
    "birth_time": "14:30:45",
    "birth_place": "Chennai",
    "latitude": 13.0827,
    "longitude": 80.2707,
    "timezone": "Asia/Kolkata",
    "created_at": "2026-09-14T10:00:00Z"
  }
}
```

**Rate Limit:** 10 charts per hour per user

---

### Get Chart

**Endpoint:** `GET /api/charts/<chart_id>`

**Description:** Retrieve chart details

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**
```json
{
  "chart": {
    "id": "chart-uuid-here",
    "user_id": "user-uuid-here",
    "name": "My Birth Chart",
    "birth_date": "1990-01-15",
    "birth_time": "14:30:45",
    "birth_place": "Chennai",
    "latitude": 13.0827,
    "longitude": 80.2707,
    "timezone": "Asia/Kolkata",
    "created_at": "2026-09-14T10:00:00Z"
  }
}
```

---

### List Charts

**Endpoint:** `GET /api/charts`

**Description:** List all user's charts

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `limit` (integer, optional) - Number of charts to return (default: 20)
- `offset` (integer, optional) - Number of charts to skip (default: 0)

**Success Response (200 OK):**
```json
{
  "charts": [
    {
      "id": "chart-uuid-1",
      "name": "My Birth Chart",
      "birth_date": "1990-01-15",
      "birth_place": "Chennai",
      "created_at": "2026-09-14T10:00:00Z"
    }
  ],
  "total": 5,
  "limit": 20,
  "offset": 0
}
```

---

## Calculation Endpoints

### Compute Divisional Charts

**Endpoint:** `POST /api/charts/compute`

**Description:** Calculate divisional charts (D1, D9, D10, D20)

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "birth_date": "1990-01-15",
  "birth_time": "14:30:45",
  "birth_place": "Chennai",
  "latitude": 13.0827,
  "longitude": 80.2707,
  "timezone": "Asia/Kolkata"
}
```

**Success Response (200 OK):**
```json
{
  "D1": {
    "chart_type": "D1 (Rasi Chart)",
    "points": [
      {
        "label": "Sun",
        "rasiName": "Makara",
        "deg": 295.42,
        "kp": "Makara / 25°25' / Pushyami"
      }
    ]
  },
  "D9": {
    "chart_type": "D9 (Navamsha Chart)",
    "points": [...]
  },
  "D10": {...},
  "D20": {...}
}
```

---

### Detect Yogas

**Endpoint:** `POST /api/charts/yogas/detect`

**Description:** Detect yogas in the birth chart

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "birth_date": "1990-01-15",
  "birth_time": "14:30:45",
  "birth_place": "Chennai",
  "latitude": 13.0827,
  "longitude": 80.2707,
  "timezone": "Asia/Kolkata"
}
```

**Success Response (200 OK):**
```json
{
  "yogas": [
    {
      "name": "Mangal Dosha",
      "type": "Malefic",
      "strength": 85,
      "description": "Mars in 1, 4, 7, 8, or 12 house from Lagna or Moon"
    }
  ]
}
```

---

### Analyze House Strength

**Endpoint:** `POST /api/charts/bhava-bala/analyze`

**Description:** Calculate house strength (Bhava Bala)

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "birth_date": "1990-01-15",
  "birth_time": "14:30:45",
  "birth_place": "Chennai",
  "latitude": 13.0827,
  "longitude": 80.2707,
  "timezone": "Asia/Kolkata"
}
```

**Success Response (200 OK):**
```json
{
  "houses": [
    {
      "house": 1,
      "name": "Dharma (Life, Personality)",
      "strength": 78,
      "color": "green",
      "planets": ["Sun", "Mercury"]
    }
  ]
}
```

---

### Calculate Dasha Timeline

**Endpoint:** `POST /api/charts/vimshottari-dasha/calculate`

**Description:** Calculate Vimshottari Dasha periods (120-year cycle)

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "birth_date": "1990-01-15",
  "birth_time": "14:30:45",
  "birth_place": "Chennai",
  "latitude": 13.0827,
  "longitude": 80.2707,
  "timezone": "Asia/Kolkata"
}
```

**Success Response (200 OK):**
```json
{
  "current_dasha": {
    "maha_dasha": "Rahu",
    "bhukti": "Venus",
    "start_date": "2020-01-15",
    "end_date": "2027-03-15"
  },
  "timeline": [
    {
      "period": "Rahu Mahadasha",
      "start_date": "1992-03-15",
      "end_date": "2010-01-15",
      "duration_years": 18
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "error": "Invalid input data",
  "details": "Latitude must be between -90 and 90"
}
```

### 401 Unauthorized

```json
{
  "error": "Unauthorized",
  "details": "Invalid or expired token"
}
```

### 403 Forbidden

```json
{
  "error": "Forbidden",
  "details": "Access denied"
}
```

### 404 Not Found

```json
{
  "error": "Not found",
  "details": "Chart not found"
}
```

### 429 Too Many Requests

```json
{
  "error": "Too many requests",
  "retry_after": 300
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error",
  "details": "An error occurred while processing your request"
}
```

---

## Rate Limiting

All endpoints are subject to rate limiting:

| Endpoint | Limit | Window |
|----------|-------|--------|
| POST /auth/signup | 3 | 1 hour |
| POST /auth/login | 5 | 15 minutes |
| POST /auth/change-password | 5 | 1 hour |
| POST /charts/create | 10 | 1 hour |
| Other endpoints | 100 | 1 hour |

**Rate Limit Headers:**
- `X-RateLimit-Limit` - Maximum requests allowed
- `X-RateLimit-Remaining` - Requests remaining in current window
- `X-RateLimit-Reset` - Unix timestamp when limit resets

---

## Security Headers

All responses include security headers:

```
Content-Security-Policy: default-src 'self'; script-src 'self';
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

---

## Authentication Flow

1. **User Registration**
   - POST `/api/auth/signup` with credentials
   - Receive `access_token` and `refresh_token`

2. **User Login**
   - POST `/api/auth/login` with credentials
   - Receive `access_token` and `refresh_token`

3. **API Requests**
   - Include `Authorization: Bearer <access_token>` header
   - Token expires in 15 minutes

4. **Token Refresh**
   - POST `/api/auth/refresh` with `Authorization: Bearer <refresh_token>`
   - Receive new `access_token`

5. **Logout**
   - POST `/api/auth/logout`
   - Token is blacklisted and cannot be used again

---

## Testing the API

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "StrongPass123!@#",
    "name": "Test User"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "StrongPass123!@#"
  }'

# Create Chart (with token)
curl -X POST http://localhost:5000/api/charts/create \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Chart",
    "birth_date": "1990-01-15",
    "birth_time": "14:30:45",
    "birth_place": "Chennai",
    "latitude": 13.0827,
    "longitude": 80.2707
  }'
```

### Using Python

```python
import requests

BASE_URL = "http://localhost:5000/api"

# Login
login_response = requests.post(
    f"{BASE_URL}/auth/login",
    json={
        "email": "test@example.com",
        "password": "StrongPass123!@#"
    }
)
token = login_response.json()["access_token"]

# Create Chart
chart_response = requests.post(
    f"{BASE_URL}/charts/create",
    headers={"Authorization": f"Bearer {token}"},
    json={
        "name": "My Chart",
        "birth_date": "1990-01-15",
        "birth_time": "14:30:45",
        "birth_place": "Chennai",
        "latitude": 13.0827,
        "longitude": 80.2707
    }
)
```

---

## Support & Troubleshooting

**Common Issues:**

1. **Invalid Token Error**
   - Ensure token is not expired (15 min validity)
   - Use refresh endpoint to get new token
   - Check Authorization header format: `Bearer <token>`

2. **Rate Limit Exceeded**
   - Wait for reset time shown in `X-RateLimit-Reset` header
   - Implement exponential backoff in your client

3. **Invalid Input Error**
   - Check all required fields are provided
   - Validate data formats (dates, coordinates)
   - Review error message for specific validation failure

---

## Version History

- **v1.0.0** (2026-09-14) - Initial release with all core endpoints

---

**Last Updated:** 2026-09-14  
**Status:** Production Ready ✅

