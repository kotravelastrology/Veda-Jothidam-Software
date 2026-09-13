# Taara Vedic Backend API Documentation

## Authentication Endpoints

### 1. User Signup
**Endpoint:** `POST /api/auth/signup`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "User Name",
  "language": "Tamil",
  "timezone": "Asia/Kolkata"
}
```

**Response (201 Created):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "name": "User Name",
    "language": "Tamil",
    "timezone": "Asia/Kolkata",
    "created_at": "2026-09-12T14:30:00",
    "updated_at": "2026-09-12T14:30:00"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "Bearer"
}
```

**Error (409 Conflict):**
```json
{
  "error": "Email already registered"
}
```

---

### 2. User Login
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "name": "User Name",
    "language": "Tamil",
    "timezone": "Asia/Kolkata",
    "created_at": "2026-09-12T14:30:00",
    "updated_at": "2026-09-12T14:30:00"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "Bearer"
}
```

**Error (401 Unauthorized):**
```json
{
  "error": "Invalid email or password"
}
```

---

### 3. Get User Profile
**Endpoint:** `GET /api/auth/profile`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "name": "User Name",
    "language": "Tamil",
    "timezone": "Asia/Kolkata",
    "created_at": "2026-09-12T14:30:00",
    "updated_at": "2026-09-12T14:30:00"
  }
}
```

---

### 4. Update User Profile
**Endpoint:** `PUT /api/auth/profile`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "language": "Hindi",
  "timezone": "Asia/Kolkata"
}
```

**Response (200 OK):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "name": "Updated Name",
    "language": "Hindi",
    "timezone": "Asia/Kolkata",
    "created_at": "2026-09-12T14:30:00",
    "updated_at": "2026-09-12T14:31:00"
  }
}
```

---

### 5. Change Password
**Endpoint:** `POST /api/auth/change-password`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "old_password": "OldPassword123!",
  "new_password": "NewPassword456!"
}
```

**Response (200 OK):**
```json
{
  "message": "Password changed successfully"
}
```

**Error (401 Unauthorized):**
```json
{
  "error": "Old password is incorrect"
}
```

---

### 6. Logout
**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "message": "Logout successful. Please remove token from localStorage."
}
```

---

## Token Usage

All authenticated endpoints require the `Authorization` header:
```
Authorization: Bearer {access_token}
```

**Token Lifespan:** 30 days

**Storage:** Save token in frontend localStorage:
```javascript
localStorage.setItem('access_token', response.access_token);
```

**Usage in Requests:**
```javascript
const token = localStorage.getItem('access_token');
fetch('/api/auth/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## Error Responses

| Status | Error | Meaning |
|--------|-------|---------|
| 400 | Email and password required | Missing required fields |
| 401 | Invalid email or password | Wrong credentials |
| 401 | Missing Authorization Header | No token provided |
| 401 | Invalid or expired token | Token invalid/expired |
| 404 | User not found | User ID doesn't exist |
| 409 | Email already registered | Duplicate email |
| 500 | Internal server error | Server error |

---

## Example Usage (JavaScript/Frontend)

### Signup
```javascript
async function signup() {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'user@example.com',
      password: 'SecurePassword123!',
      name: 'User Name',
      language: 'Tamil'
    })
  });
  
  const data = await response.json();
  if (response.ok) {
    localStorage.setItem('access_token', data.access_token);
    console.log('User created:', data.user);
  }
}
```

### Login
```javascript
async function login() {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'user@example.com',
      password: 'SecurePassword123!'
    })
  });
  
  const data = await response.json();
  if (response.ok) {
    localStorage.setItem('access_token', data.access_token);
  }
}
```

### Get Profile
```javascript
async function getProfile() {
  const token = localStorage.getItem('access_token');
  const response = await fetch('/api/auth/profile', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const data = await response.json();
  console.log('User:', data.user);
}
```

### Logout
```javascript
function logout() {
  localStorage.removeItem('access_token');
  // Redirect to login page
}
```

---

## Chart Endpoints

### 1. Create Chart
**Endpoint:** `POST /api/charts/create`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Ram Kumar",
  "birth_date": "1990-05-15",
  "birth_time": "10:30:00",
  "birth_place": "Chennai, India",
  "latitude": 13.0827,
  "longitude": 80.2707,
  "timezone": "Asia/Kolkata"
}
```

**Response (201 Created):**
```json
{
  "message": "Chart created successfully",
  "chart": {
    "id": "uuid-string",
    "user_id": "user-id",
    "name": "Ram Kumar",
    "birth_date": "1990-05-15",
    "birth_time": "10:30:00",
    "birth_place": "Chennai, India",
    "latitude": 13.0827,
    "longitude": 80.2707,
    "timezone": "Asia/Kolkata",
    "created_at": "2026-09-12T15:00:00",
    "updated_at": "2026-09-12T15:00:00"
  }
}
```

---

### 2. List User's Charts
**Endpoint:** `GET /api/charts`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "charts": [
    {
      "id": "uuid-string",
      "user_id": "user-id",
      "name": "Ram Kumar",
      "birth_date": "1990-05-15",
      "birth_time": "10:30:00",
      "birth_place": "Chennai, India",
      "latitude": 13.0827,
      "longitude": 80.2707,
      "timezone": "Asia/Kolkata",
      "created_at": "2026-09-12T15:00:00",
      "updated_at": "2026-09-12T15:00:00",
      "phase_count": 13
    }
  ],
  "total_count": 1
}
```

---

### 3. Get Specific Chart
**Endpoint:** `GET /api/charts/{chart_id}`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "chart": {
    "id": "uuid-string",
    "user_id": "user-id",
    "name": "Ram Kumar",
    "birth_date": "1990-05-15",
    "birth_time": "10:30:00",
    "birth_place": "Chennai, India",
    "latitude": 13.0827,
    "longitude": 80.2707,
    "timezone": "Asia/Kolkata",
    "created_at": "2026-09-12T15:00:00",
    "updated_at": "2026-09-12T15:00:00"
  },
  "phases": [
    {
      "id": "phase-id",
      "chart_id": "chart-id",
      "phase_number": 1,
      "phase_name": "Birth Chart (D1)",
      "data": {
        "sun": 30.5,
        "moon": 45.2,
        ...
      },
      "created_at": "2026-09-12T15:01:00",
      "updated_at": "2026-09-12T15:01:00"
    }
  ],
  "phase_count": 13
}
```

---

### 4. Save Phase Data
**Endpoint:** `POST /api/charts/{chart_id}/save-phase`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "phase_number": 1,
  "phase_name": "Birth Chart (D1)",
  "data": {
    "sun": 30.5,
    "moon": 45.2,
    "mars": 60.1,
    "mercury": 15.8,
    "jupiter": 75.3,
    "venus": 25.4,
    "saturn": 120.6,
    "rahu": 180.0,
    "ketu": 0.0
  }
}
```

**Response (201 Created / 200 OK if updating):**
```json
{
  "message": "Phase data saved successfully",
  "phase_data": {
    "id": "phase-id",
    "chart_id": "chart-id",
    "phase_number": 1,
    "phase_name": "Birth Chart (D1)",
    "data": { ... },
    "created_at": "2026-09-12T15:01:00",
    "updated_at": "2026-09-12T15:01:00"
  }
}
```

---

### 5. Get All Phases for Chart
**Endpoint:** `GET /api/charts/{chart_id}/phases`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "chart_id": "chart-id",
  "chart_name": "Ram Kumar",
  "phases": {
    "phase_1": { ... },
    "phase_2": { ... },
    ...
    "phase_13": { ... }
  },
  "total_phases": 13
}
```

---

### 6. Get Single Phase
**Endpoint:** `GET /api/charts/{chart_id}/phase/{phase_number}`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "phase_data": {
    "id": "phase-id",
    "chart_id": "chart-id",
    "phase_number": 1,
    "phase_name": "Birth Chart (D1)",
    "data": { ... },
    "created_at": "2026-09-12T15:01:00",
    "updated_at": "2026-09-12T15:01:00"
  }
}
```

---

### 7. Update Chart
**Endpoint:** `PUT /api/charts/{chart_id}`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Ram Kumar (Updated)",
  "timezone": "America/New_York"
}
```

**Response (200 OK):**
```json
{
  "message": "Chart updated successfully",
  "chart": { ... }
}
```

---

### 8. Delete Chart
**Endpoint:** `DELETE /api/charts/{chart_id}`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "message": "Chart deleted successfully"
}
```

---

### 9. Search Charts
**Endpoint:** `GET /api/charts/search?q={query}`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "query": "Ram",
  "results": [
    {
      "id": "chart-id",
      "name": "Ram Kumar",
      "birth_date": "1990-05-15",
      "phase_count": 13,
      ...
    }
  ],
  "result_count": 1
}
```

---

## Data Persistence Features

✅ **Automatic Database Saving**
- Charts saved immediately upon creation
- Phase data persisted for each chart
- All timestamps tracked

✅ **Phase Storage (1-13)**
- Each phase stores calculation results
- Flexible JSON data format
- Update capability without duplication

✅ **User Isolation**
- Charts only accessible by their owner
- Access control enforced
- Cross-user access denied

✅ **Efficient Retrieval**
- List all charts in one call
- Get specific chart with all phases
- Search by name
- Get individual phases

---
