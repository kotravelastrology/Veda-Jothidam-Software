# Days 27-28: Security Hardening Implementation Plan

**Phase:** 30, Days 27-28  
**Focus:** Security Hardening & Optimization  
**Status:** ⏳ IN PROGRESS  
**Date Started:** 2026-09-13

---

## Overview

This document outlines the comprehensive security hardening implementation for the Vedic Astrology software backend and frontend. The focus is on protecting against OWASP Top 10 vulnerabilities and implementing industry best practices.

---

## Security Checklist & Implementation Status

### 1. INPUT VALIDATION & SANITIZATION

#### 1.1 Backend Input Validation
- [ ] Create validation middleware for all endpoints
- [ ] Validate email format (RFC 5322 compliant)
- [ ] Validate date/time formats
- [ ] Validate coordinate ranges (lat: -90 to 90, lon: -180 to 180)
- [ ] Validate file uploads (size, type, content)
- [ ] Implement field length limits
- [ ] Implement numeric range validation
- [ ] Add validation for birth place names
- [ ] Sanitize all string inputs

**Implementation File:** `backend/validators.py` (NEW)

```python
# Validators for all input types
- EmailValidator
- DateValidator
- TimeValidator
- CoordinateValidator
- FileValidator
- StringLengthValidator
```

#### 1.2 Frontend Input Validation
- [ ] Validate form inputs on client-side
- [ ] Real-time validation feedback
- [ ] Prevent submission of invalid data
- [ ] Display clear error messages
- [ ] Implement character encoding validation

**Implementation File:** `src/utils/validators.ts` (NEW)

#### Status: ⏳ TODO

---

### 2. SQL INJECTION PREVENTION

#### Current Status Review
- ✅ SQLAlchemy ORM already prevents SQL injection
- ✅ Parameterized queries in use
- ⚠️ Need to add additional safeguards

#### 2.1 Additional Measures
- [ ] Add SQL injection detection middleware
- [ ] Log suspicious queries
- [ ] Implement query rate limiting per user
- [ ] Add database-level constraints
- [ ] Validate all ORM inputs

**Implementation:** Add to `backend/app.py`

#### Status: ⏳ TODO

---

### 3. XSS (Cross-Site Scripting) PROTECTION

#### 3.1 Backend Measures
- [ ] Add response headers (Content-Security-Policy)
- [ ] Sanitize all JSON responses
- [ ] Escape special characters in outputs
- [ ] Implement X-Frame-Options header
- [ ] Add X-Content-Type-Options header
- [ ] Enable X-XSS-Protection header

**Implementation File:** `backend/security.py` (NEW)

#### 3.2 Frontend Measures
- [ ] Use React's built-in XSS protection
- [ ] Avoid dangerouslySetInnerHTML
- [ ] Sanitize user-generated content
- [ ] Implement Content Security Policy
- [ ] Validate and escape all external data

**Implementation File:** `src/utils/sanitizers.ts` (NEW)

#### Status: ⏳ TODO

---

### 4. CSRF (Cross-Site Request Forgery) PROTECTION

#### 4.1 CSRF Token Implementation
- [ ] Generate CSRF tokens for each session
- [ ] Store CSRF tokens in HttpOnly cookies
- [ ] Validate CSRF tokens on state-changing requests
- [ ] Implement SameSite cookie policy
- [ ] Add CSRF middleware

**Implementation File:** `backend/csrf.py` (NEW)

#### 4.2 Frontend CSRF Handling
- [ ] Retrieve CSRF token from API
- [ ] Include CSRF token in all POST/PUT/DELETE requests
- [ ] Handle CSRF token rotation

**Implementation File:** `src/hooks/useCsrfToken.ts` (NEW)

#### Status: ⏳ TODO

---

### 5. CORS (Cross-Origin Resource Sharing)

#### Current Configuration
```python
CORS(app, origins=['http://localhost:3000', 'http://localhost:5000'])
```

#### 5.1 CORS Hardening
- [ ] Remove hardcoded origins from code
- [ ] Load origins from environment variables
- [ ] Validate origins against whitelist
- [ ] Set proper CORS headers:
  - Access-Control-Allow-Origin
  - Access-Control-Allow-Methods
  - Access-Control-Allow-Headers
  - Access-Control-Max-Age
  - Access-Control-Allow-Credentials
- [ ] Implement credentials: 'include' for sensitive operations
- [ ] Disable CORS for sensitive endpoints if applicable

**Implementation File:** `backend/cors_config.py` (NEW)

**Environment Variables to Add:**
```
ALLOWED_ORIGINS=http://localhost:3000,https://example.com
CORS_MAX_AGE=3600
CORS_ALLOW_CREDENTIALS=true
```

#### Status: ⏳ TODO

---

### 6. RATE LIMITING

#### 6.1 Implementation Strategy
- [ ] Install Flask-Limiter
- [ ] Set global rate limits (e.g., 100 requests/hour)
- [ ] Set per-endpoint rate limits:
  - Login: 5 attempts/15 minutes
  - Signup: 3 attempts/hour per IP
  - Chart creation: 10/hour per user
  - File upload: 5/hour per user
- [ ] Implement IP-based rate limiting
- [ ] Implement user-based rate limiting
- [ ] Return 429 (Too Many Requests) when limit exceeded
- [ ] Include X-RateLimit headers in responses
- [ ] Add rate limit bypass for admin users

**Implementation File:** `backend/rate_limiter.py` (NEW)

#### Status: ⏳ TODO

---

### 7. JWT TOKEN MANAGEMENT

#### Current Implementation Issues
- ⚠️ Token expiration too long (30 days)
- ⚠️ No refresh token mechanism
- ⚠️ No token blacklisting

#### 7.1 JWT Improvements
- [ ] Reduce access token expiration to 15 minutes
- [ ] Implement refresh tokens (7 days expiration)
- [ ] Create token refresh endpoint
- [ ] Implement token blacklisting for logout
- [ ] Store blacklist in Redis or database
- [ ] Validate token signature
- [ ] Add token revocation mechanism
- [ ] Implement refresh token rotation

**Implementation File:** `backend/jwt_handler.py` (NEW)

**Configuration to Update:**
```python
# Current (INSECURE)
expires_delta=timedelta(days=30)

# New (SECURE)
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7
```

#### Status: ⏳ TODO

---

### 8. PASSWORD SECURITY

#### Current Status
- ✅ Using werkzeug.security.generate_password_hash (bcrypt)
- ⚠️ No password strength requirements
- ⚠️ No password history
- ⚠️ No failed login tracking

#### 8.1 Password Hardening
- [ ] Implement password strength validation:
  - Minimum 12 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
  - At least 1 special character
- [ ] Implement password history (prevent reuse of last 5 passwords)
- [ ] Add failed login attempt tracking
- [ ] Lock account after 5 failed attempts
- [ ] Implement account unlock mechanism
- [ ] Add password expiration policy (90 days)
- [ ] Send password change notifications

**Implementation File:** `backend/password_policy.py` (NEW)

#### Status: ⏳ TODO

---

### 9. ENVIRONMENT VARIABLES & SECRETS MANAGEMENT

#### Current Issues
- ⚠️ Default JWT secret in code: `'your-secret-key-change-in-production'`
- ⚠️ Database credentials might be in code
- ⚠️ API keys exposed

#### 9.1 Secrets Management
- [ ] Move all secrets to `.env` file
- [ ] Add `.env` to `.gitignore` (already done)
- [ ] Create `.env.example` with placeholder values
- [ ] Validate required environment variables on startup
- [ ] Use strong default JWT secret
- [ ] Generate secure random secrets for production
- [ ] Implement secret rotation mechanism
- [ ] Use environment-specific configs (dev, staging, prod)

**Required Environment Variables:**
```
FLASK_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/db
JWT_SECRET_KEY=<strong-random-key>
REFRESH_TOKEN_SECRET=<strong-random-key>
ALLOWED_ORIGINS=https://example.com,https://www.example.com
BCRYPT_LOG_ROUNDS=12
REDIS_URL=redis://localhost:6379
DEBUG=false
SECURE_COOKIES=true
```

**Files to Create:**
- `backend/.env.example` (NEW)
- `backend/config.py` (NEW - configuration loader)

#### Status: ⏳ TODO

---

### 10. HTTPS/TLS CONFIGURATION

#### 10.1 HTTPS Implementation
- [ ] Generate self-signed certificate for development
- [ ] Configure Flask to use HTTPS
- [ ] Set HSTS (HTTP Strict Transport Security) header
- [ ] Force redirect from HTTP to HTTPS
- [ ] Set secure cookies (HttpOnly, Secure, SameSite)
- [ ] Implement HSTS preload

**Configuration to Add:**
```python
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'
PERMANENT_SESSION_LIFETIME = timedelta(hours=24)
```

**HTTPS Headers to Set:**
```python
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

#### Status: ⏳ TODO

---

### 11. LOGGING & MONITORING

#### 11.1 Security Logging
- [ ] Log all authentication attempts
- [ ] Log all failed authorization attempts
- [ ] Log all data modifications
- [ ] Log API errors with stack traces
- [ ] Log rate limit violations
- [ ] Log suspicious activities
- [ ] Implement structured logging (JSON format)
- [ ] Set appropriate log rotation

**Implementation File:** `backend/logger.py` (NEW)

#### 11.2 Monitoring & Alerting
- [ ] Setup error tracking (e.g., Sentry)
- [ ] Monitor failed login attempts
- [ ] Alert on rate limit abuse
- [ ] Track API performance metrics
- [ ] Setup uptime monitoring

#### Status: ⏳ TODO

---

### 12. ERROR HANDLING

#### 12.1 Generic Error Messages
- [ ] Never expose internal error details to client
- [ ] Log detailed errors server-side only
- [ ] Return generic "Something went wrong" messages
- [ ] Use proper HTTP status codes
- [ ] Avoid revealing system information

**Implementation File:** Update all route handlers

#### Status: ⏳ TODO

---

### 13. SECURITY HEADERS

#### 13.1 Headers to Implement
- [ ] Content-Security-Policy
- [ ] X-Frame-Options
- [ ] X-Content-Type-Options
- [ ] X-XSS-Protection
- [ ] Referrer-Policy
- [ ] Strict-Transport-Security
- [ ] Permissions-Policy

**Implementation File:** `backend/security_headers.py` (NEW)

#### Status: ⏳ TODO

---

### 14. DEPENDENCIES & VULNERABILITY SCANNING

#### 14.1 Dependency Management
- [ ] Run `npm audit` to check for vulnerabilities
- [ ] Run `pip audit` to check Python packages
- [ ] Update all dependencies to latest secure versions
- [ ] Implement automated dependency updates (Dependabot)
- [ ] Review security advisories regularly

**Commands:**
```bash
npm audit
npm audit fix
pip audit
pip list --outdated
```

#### Status: ⏳ TODO

---

## Implementation Timeline

### Day 27: Core Security Implementation (Morning - Afternoon)

**Phase 1: Setup (9:00 AM - 10:00 AM)**
- [ ] Create security utility files
- [ ] Setup logging system
- [ ] Create configuration loader

**Phase 2: Input Validation (10:00 AM - 12:00 PM)**
- [ ] Create validators.py
- [ ] Update all route handlers with validation
- [ ] Test validation on all endpoints

**Phase 3: JWT & Password Security (1:00 PM - 3:00 PM)**
- [ ] Implement JWT token refresh mechanism
- [ ] Add password strength validation
- [ ] Update password change endpoint
- [ ] Implement failed login tracking

**Phase 4: CORS & CSRF (3:00 PM - 5:00 PM)**
- [ ] Create CORS configuration
- [ ] Implement CSRF protection
- [ ] Update environment variables
- [ ] Test CSRF token handling

**Phase 5: Testing & Validation (5:00 PM - 6:00 PM)**
- [ ] Run security tests
- [ ] Check for vulnerabilities
- [ ] Document issues found

### Day 28: Hardening & Optimization (Full Day)

**Phase 1: Rate Limiting & Headers (9:00 AM - 11:00 AM)**
- [ ] Implement rate limiting
- [ ] Add security headers
- [ ] Configure HTTPS locally

**Phase 2: Logging & Monitoring (11:00 AM - 1:00 PM)**
- [ ] Setup structured logging
- [ ] Implement audit logging
- [ ] Configure error tracking

**Phase 3: Database Security (1:00 PM - 2:00 PM)**
- [ ] Review SQL injection prevention
- [ ] Implement database-level constraints
- [ ] Add query logging

**Phase 4: Dependency Audit (2:00 PM - 3:00 PM)**
- [ ] Run security audits
- [ ] Update vulnerable dependencies
- [ ] Fix reported issues

**Phase 5: Final Testing (3:00 PM - 5:00 PM)**
- [ ] Comprehensive security testing
- [ ] Penetration testing attempts
- [ ] Load testing with security measures
- [ ] Documentation update

**Phase 6: Sign-off (5:00 PM - 6:00 PM)**
- [ ] Final review
- [ ] Create security report
- [ ] Commit all changes
- [ ] Prepare for Days 29-30

---

## Files to Create/Modify

### New Files (Security)
1. `backend/validators.py` - Input validation logic
2. `backend/security.py` - Security utilities
3. `backend/csrf.py` - CSRF protection
4. `backend/jwt_handler.py` - JWT token management
5. `backend/password_policy.py` - Password validation
6. `backend/rate_limiter.py` - Rate limiting
7. `backend/cors_config.py` - CORS configuration
8. `backend/security_headers.py` - Security headers
9. `backend/logger.py` - Structured logging
10. `backend/config.py` - Configuration management
11. `backend/.env.example` - Environment template
12. `src/utils/sanitizers.ts` - Frontend XSS protection
13. `src/hooks/useCsrfToken.ts` - CSRF token hook

### Files to Modify
1. `backend/app.py` - Add security middleware
2. `backend/routes/auth.py` - Add validation, password policy
3. `backend/routes/charts.py` - Add validation
4. `backend/models/user.py` - Add fields for security
5. `.env.local` - Add security variables
6. `.gitignore` - Ensure .env is ignored
7. `package.json` - Add security dependencies

### Files to Create (Tests)
1. `backend/test_security.py` - Security tests
2. `tests/security.test.ts` - Frontend security tests

---

## Security Dependencies to Install

### Backend (Python)
```bash
pip install flask-limiter
pip install email-validator
pip install bleach
pip install cryptography
pip install pyotp  # For 2FA (optional)
```

### Frontend (Node.js)
```bash
npm install isomorphic-fetch
npm install dompurify
npm install helmet
```

---

## Testing Strategy

### Automated Testing
- Unit tests for validators
- Unit tests for security functions
- Integration tests for API endpoints
- Security scanning tools

### Manual Testing
- OWASP Top 10 checklist
- Penetration testing
- XSS injection attempts
- CSRF attempts
- SQL injection attempts
- Rate limit testing

### Tools to Use
- OWASP ZAP (automated security scanning)
- Burp Suite Community (manual testing)
- npm audit (dependency scanning)
- pip-audit (Python dependency scanning)
- Lighthouse (performance & security audit)

---

## Success Criteria

✅ **Day 27-28 Complete When:**
- [ ] All input validation implemented
- [ ] JWT token refresh working
- [ ] CSRF protection in place
- [ ] Rate limiting functional
- [ ] Security headers configured
- [ ] All sensitive data in environment variables
- [ ] Logging implemented
- [ ] HTTPS working (development)
- [ ] All security tests passing
- [ ] OWASP Top 10 coverage verified
- [ ] No critical/high severity vulnerabilities
- [ ] Documentation complete
- [ ] Code reviewed and approved

---

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| Breaking changes | Medium | Medium | Comprehensive testing, gradual rollout |
| Performance impact | Medium | Low | Profile, optimize, cache strategically |
| Dependency conflicts | Low | Medium | Test all updates, use compatible versions |
| User experience | Low | Low | Clear error messages, good UX |

---

## Sign-off Checklist

**Developer Sign-off:**
- [ ] All security measures implemented
- [ ] Tests passing (100%)
- [ ] Code reviewed
- [ ] Documentation complete
- [ ] Ready for production deployment

**Security Review Sign-off:**
- [ ] Security audit passed
- [ ] No critical vulnerabilities
- [ ] OWASP compliance verified
- [ ] Ready for Days 29-30

---

## Notes

- All passwords must be hashed with bcrypt (12 rounds minimum)
- All API responses should have security headers
- All database queries should use parameterized statements
- All user inputs should be validated and sanitized
- All secrets should be in environment variables
- All logs should be structured and monitored

