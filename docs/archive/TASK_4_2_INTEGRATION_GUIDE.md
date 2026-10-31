# Task 4.2 - API Integration & State Management
## வேத ஜோதிடம் - Week 4 API Integration

**Status:** ✅ COMPLETED  
**Time:** 3.5 hours  
**Priority:** CRITICAL

---

## Summary

Task 4.2 implemented the complete API integration layer and state management system that connects all frontend pages to backend APIs. This includes centralized API client, service layers, state management, and utility functions.

---

## Architecture Overview

```
Frontend Pages
    ↓
Services Layer (Auth, Charts, Consultations, etc.)
    ↓
API Client (Fetch wrapper with token management)
    ↓
State Management Store
    ↓
Backend APIs
```

---

## Files Created

### 1. **API Client** (`frontend/services/api.js` - 250+ lines)

Centralized HTTP client with:
- Automatic token management
- Token refresh logic
- Request/response interceptors
- Error handling with custom ApiError class
- Retry mechanism for failed requests
- Request timeout handling
- Queue system for concurrent token refresh

**Key Classes:**

```javascript
class ApiClient {
  // Core methods
  get(url, options)
  post(url, data, options)
  put(url, data, options)
  patch(url, data, options)
  delete(url, options)
  
  // Token management
  getToken()
  getRefreshToken()
  setTokens(access, refresh)
  clearTokens()
  refreshAccessToken()
  
  // Request handling
  request(method, url, data, options)
}

class ApiError extends Error {
  isAuthError()
  isValidationError()
  isNotFound()
  isServerError()
  getFieldError(field)
}
```

**Features:**
```
✓ Automatic Bearer token injection
✓ 401 error handling with token refresh
✓ Request retry on token refresh
✓ Concurrent request queuing
✓ Request timeout (30s default)
✓ Custom error types
✓ Abort signal support
✓ JSON response parsing
```

### 2. **Authentication Service** (`frontend/services/auth.js` - 300+ lines)

Handles user authentication and profile management:

```javascript
class AuthService {
  // Authentication
  register(data)
  login(email, password)
  logout()
  refreshToken()
  
  // Profile
  getProfile()
  updateProfile(data)
  
  // Account
  changePassword(current, new)
  requestPasswordReset(email)
  resetPassword(token, newPassword)
  
  // Settings
  getSettings()
  updateSettings(settings)
  getSubscription()
  
  // Utilities
  isAuthenticated()
  getUser()
  setUser(user)
  checkPasswordStrength(password)
  validateEmail(email)
  validateUsername(username)
}
```

**Features:**
```
✓ User registration with validation
✓ Email/password authentication
✓ JWT token management
✓ Profile CRUD operations
✓ Password strength checking
✓ Password reset flow
✓ Settings management
✓ Subscription info
```

### 3. **Data Services** (`frontend/services/data.js` - 400+ lines)

Service layer for all data operations:

**ChartService**
```javascript
// CRUD
create(chartData)
list(options)
get(chartId)
update(chartId, updates)
delete(chartId)

// Data
saveData(chartId, data)
setPublic(chartId, isPublic)

// Queries
getShared(options)
getStats()
```

**ConsultationService**
```javascript
book(consultationData)
list(options)
get(consultationId)
update(consultationId, updates)
cancel(consultationId, reason)
getStats()
```

**AstrologerService**
```javascript
getAvailable(filters)
get(astrologerId)
```

**DashboardService**
```javascript
getOverview()
getActivity(options)
getStats()
getRecommendations()
```

**InterpretationService**
```javascript
getForChart(chartId)
get(interpretationId)
generate(chartId, type)
share(interpretationId, emails)
```

**ExportService**
```javascript
exportToPdf(chartId)
exportToJson(chartId)
sendViaEmail(chartId, email)
```

### 4. **State Management** (`frontend/services/store.js` - 350+ lines)

Simple but powerful state management:

```javascript
class Store {
  // State access
  getState()
  get(path)
  setState(path, value)
  updateState(path, updates)
  
  // Subscriptions
  subscribe(path, callback)
  subscribe(callback)
  
  // Caching
  setCache(key, value, ttl)
  getCache(key)
  clearCache(key)
  
  // Persistence
  persistToStorage(key)
  loadFromStorage(key)
  reset()
}
```

**Global App Store State:**
```javascript
{
  auth: {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  charts: {
    list: [],
    current: null,
    loading: false,
    error: null,
    pagination: { page, perPage, total }
  },
  consultations: {
    list: [],
    current: null,
    loading: false,
    error: null,
    booking: { isOpen, loading, error }
  },
  astrologers: {
    list: [],
    loading: false,
    error: null,
  },
  dashboard: {
    overview: null,
    activity: [],
    stats: null,
    recommendations: [],
    loading: false,
    error: null,
  },
  ui: {
    theme: 'light',
    language: 'en',
    notifications: [],
    loading: false,
    modal: { isOpen, type, data }
  },
  interpretations: {
    results: null,
    loading: false,
    error: null,
  }
}
```

**Notification Helpers:**
```javascript
addNotification(message, type, duration)
removeNotification(id)
showSuccess(message)
showError(message)
showInfo(message)
showWarning(message)
```

### 5. **Utility Functions** (`frontend/services/utils.js` - 400+ lines)

Common helper functions:

**Date Utilities**
```javascript
formatDate(date, format)
toISOString(date)
formatRelativeTime(date)
formatTime(time)
getDateRange(days)
```

**Number Formatting**
```javascript
formatCurrency(amount, currency)
formatPercentage(value, decimals)
formatNumber(num)
```

**String Utilities**
```javascript
capitalize(str)
toTitleCase(str)
truncate(str, length)
generateId()
```

**Validation**
```javascript
validateEmail(email)
validatePassword(password)
validateUsername(username)
validateUrl(url)
```

**Object/Array Utilities**
```javascript
deepClone(obj)
mergeObjects(...objects)
isEmpty(obj)
getValueByPath(obj, path)
unique(arr, key)
chunk(arr, size)
groupBy(arr, key)
```

**Performance**
```javascript
debounce(func, delay)
throttle(func, delay)
```

**Storage**
```javascript
setStorageWithExpiry(key, value, hours)
getStorageWithExpiry(key)
```

**Error Handling**
```javascript
getErrorMessage(error)
logError(error, context)
```

---

## Integration Pattern

### Example: Authentication Flow

```javascript
// 1. Initialize API client
import { apiClient } from './services/api.js';

// 2. Get auth service
import { getAuthService } from './services/auth.js';
const auth = getAuthService(apiClient);

// 3. Use in component
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        appStore.setState('auth.loading', true);
        
        const response = await auth.login(email, password);
        
        appStore.setState('auth.isAuthenticated', true);
        appStore.setState('auth.user', response.user);
        
        showSuccess('Login successful!');
        window.location.href = '/dashboard';
        
    } catch (error) {
        const message = getErrorMessage(error);
        appStore.setState('auth.error', message);
        showError(message);
    } finally {
        appStore.setState('auth.loading', false);
    }
});
```

### Example: Chart Operations

```javascript
// 1. Get services
import { createServices } from './services/data.js';
const services = createServices(apiClient);

// 2. Create chart
async function createChart(data) {
    try {
        appStore.setState('charts.loading', true);
        
        const response = await services.charts.create(data);
        
        appStore.setState('charts.current', response.chart);
        showSuccess('Chart created successfully!');
        
    } catch (error) {
        showError(getErrorMessage(error));
    } finally {
        appStore.setState('charts.loading', false);
    }
}

// 3. List charts
async function loadCharts(page = 1) {
    try {
        const response = await services.charts.list({
            page,
            perPage: 10,
        });
        
        appStore.setState('charts.list', response.charts);
        appStore.setState('charts.pagination', response.pagination);
        
    } catch (error) {
        showError(getErrorMessage(error));
    }
}

// 4. Subscribe to state changes
appStore.subscribe('charts.list', (newList, oldList) => {
    console.log('Charts updated:', newList);
    updateUI(newList);
});
```

### Example: Dashboard Integration

```javascript
// Load dashboard data
async function loadDashboard() {
    try {
        appStore.setState('dashboard.loading', true);
        
        const [overview, activity, stats, recommendations] = await Promise.all([
            services.dashboard.getOverview(),
            services.dashboard.getActivity({ days: 7 }),
            services.dashboard.getStats(),
            services.dashboard.getRecommendations(),
        ]);
        
        appStore.updateState('dashboard', {
            overview,
            activity,
            stats,
            recommendations,
            loading: false,
        });
        
    } catch (error) {
        showError(getErrorMessage(error));
        appStore.setState('dashboard.error', getErrorMessage(error));
    }
}
```

---

## API Request Examples

### Login Request
```javascript
const response = await apiClient.post('/auth/login', {
    email: 'user@example.com',
    password: 'password123'
}, { skipAuth: true });

// Response:
{
    success: true,
    user_id: "uuid",
    token: "jwt_token",
    refresh_token: "jwt_refresh_token",
    user: { id, email, username, full_name, is_premium, language }
}
```

### Create Chart Request
```javascript
const response = await apiClient.post('/charts', {
    name: 'My Chart',
    birth_date: '1990-05-15',
    birth_time: '10:30:00',
    birth_place: 'New York, USA',
    birth_latitude: 40.7128,
    birth_longitude: -74.0060,
    description: 'My birth chart'
});

// Response:
{
    success: true,
    chart_id: "uuid",
    chart: { id, name, birth_date, created_at, ... }
}
```

### Book Consultation Request
```javascript
const response = await apiClient.post('/consultations', {
    title: 'Career Guidance',
    description: 'Need help with career transition',
    consultation_type: 'online',
    scheduled_date: '2026-09-25T15:00:00',
    duration_minutes: 60,
    timezone: 'UTC',
    astrologer_id: 'uuid' // optional
});

// Response:
{
    success: true,
    consultation_id: "uuid",
    status: "pending",
    confirmation_email_sent: true
}
```

---

## Error Handling

### API Errors
```javascript
try {
    await apiClient.post('/charts', data);
} catch (error) {
    if (error.isAuthError()) {
        // 401/403 - redirect to login
        window.location.href = '/auth/login';
    } else if (error.isValidationError()) {
        // 400 - show form errors
        showError(error.getFieldError('email'));
    } else if (error.isNotFound()) {
        // 404 - show not found message
        showError('Resource not found');
    } else if (error.isServerError()) {
        // 500+ - show generic error
        showError('Server error. Please try again later.');
    }
}
```

### State-based Error Display
```javascript
// Subscribe to auth errors
appStore.subscribe('auth.error', (error) => {
    if (error) {
        showError(error);
    }
});

// Subscribe to chart errors
appStore.subscribe('charts.error', (error) => {
    if (error) {
        showError(error);
    }
});
```

---

## Token Refresh Flow

```
1. User makes API request
2. API returns 401 (token expired)
3. ApiClient detects 401
4. Sets isRefreshing = true
5. Queues remaining requests
6. Calls POST /auth/refresh
7. Stores new token
8. Processes queued requests
9. Retries original request
10. Returns response
```

---

## Caching Strategy

### Short-term Cache (5 minutes)
```javascript
// Store data
apiClient.setCache('astrologers_available', data, 5 * 60 * 1000);

// Retrieve data
const cached = apiClient.getCache('astrologers_available');
if (cached) {
    // Use cached data
} else {
    // Fetch new data
}
```

### Persistent Storage
```javascript
// With expiry
setStorageWithExpiry('dashboard_stats', data, 1); // 1 hour

// Retrieve
const data = getStorageWithExpiry('dashboard_stats');
```

---

## File Statistics

**Total Service Files:** 5  
**Total Lines of Code:** 1,700+

- api.js: 250 lines
- auth.js: 300 lines
- data.js: 400 lines
- store.js: 350 lines
- utils.js: 400 lines

---

## Key Features Implemented

✅ **Automatic Token Management**
- JWT token storage
- Automatic token refresh
- Bearer token injection
- Logout clearing

✅ **Error Handling**
- Custom ApiError class
- Error categorization
- User-friendly messages
- Field validation errors

✅ **State Management**
- Centralized app store
- Subscriber pattern
- Nested state paths
- State persistence

✅ **Caching**
- In-memory cache with TTL
- localStorage with expiry
- Cache invalidation

✅ **Utility Functions**
- 50+ helper functions
- Date/time formatting
- Number formatting
- String manipulation
- Array operations
- Object utilities
- Debounce/throttle
- Validation helpers

✅ **Service Layer**
- 6 service classes
- 50+ API methods
- Consistent interface
- Proper error handling

---

## Integration Checklist

For each frontend page:

- [ ] Import required services
- [ ] Initialize API client
- [ ] Get service instances
- [ ] Subscribe to relevant state
- [ ] Load initial data
- [ ] Handle loading states
- [ ] Handle errors
- [ ] Update state on success
- [ ] Show notifications
- [ ] Clean up subscriptions on unmount

---

## Next Steps

### Task 4.3: Testing & QA
- Unit tests for services
- Integration tests for API flows
- Mock API for testing
- Error scenario testing

### Task 4.4: Docker & Deployment
- Frontend build optimization
- Environment configuration
- Docker setup
- CI/CD pipeline

### Task 4.5: Advanced Features
- WebSocket for real-time updates
- Offline support
- Service worker
- Performance optimization

---

## Summary

✅ Complete API client with token management  
✅ Authentication service with full user flow  
✅ Data services for all features  
✅ State management system  
✅ 50+ utility functions  
✅ Error handling & notifications  
✅ Caching strategies  
✅ Ready for page integration  

**Task 4.2 Status: READY FOR TASK 4.3 (Testing & QA)**

---

Generated: September 22, 2026  
Project: Veda Jothidam - Vedic Astrology Platform  
Week: 4 - Frontend & Deployment
