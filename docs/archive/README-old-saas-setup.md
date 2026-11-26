# Veda Jothidam - Vedic Astrology SaaS Platform

A complete, containerized Vedic Astrology Software-as-a-Service (SaaS) application with astrological calculations, user management, and consultation booking. Built with Flask backend, Vanilla JavaScript frontend, and Docker containerization for local and production deployment.

**Status:** 🟢 Local Deployment Complete | **Docker:** ✅ Fully Containerized | **Version:** 1.0.0

## 🏗️ Architecture

### 🟢 Current Setup (Local Development with Docker)

The application is fully containerized with 4 microservices running independently:

```
Frontend (http://localhost:3000)
    ↓
    ├─→ Nginx Reverse Proxy (in production)
    ↓
Backend API (http://localhost:5000)
    ├─→ PostgreSQL Database (localhost:5432)
    └─→ Redis Cache (localhost:6379)
```

### ✨ Core Components

1. **Frontend Service**
   - Vanilla JavaScript ES6+ (no framework)
   - HTML5 & CSS3
   - http-server for serving static files
   - Dockerized with Alpine Linux
   - Running on Port 3000

2. **Backend Service**
   - Flask 2.3.3 WSGI framework
   - Gunicorn application server (4 workers, 2 threads)
   - RESTful API with JWT authentication
   - SQLAlchemy ORM for database abstraction
   - Dockerized with Python 3.11
   - Running on Port 5000

3. **Database Service**
   - PostgreSQL 15 (Docker)
   - Persistent named volume
   - User: `veda_user` | Password: `veda_password_123`
   - Database: `veda_jothidam`
   - Running on Port 5432

4. **Cache Service**
   - Redis 7 (Docker)
   - Session management
   - Token blacklist tracking
   - Running on Port 6379

## 🛠️ Technology Stack

### Frontend Layer
- **Language:** Vanilla JavaScript ES6+
- **Markup:** HTML5
- **Styling:** CSS3 (no framework)
- **Server:** http-server (Alpine Linux)
- **Container:** Docker 18-alpine
- **Dependencies:** Zero (no npm required)
- **Port:** 3000

### Backend Layer
- **Framework:** Flask 2.3.3
- **Language:** Python 3.11
- **WSGI Server:** Gunicorn 21.2.0
- **ORM:** SQLAlchemy
- **Authentication:** Flask-JWT-Extended
- **CORS:** Flask-CORS
- **Container:** Python 3.11-slim
- **Workers:** 4 (with 2 threads each)
- **Port:** 5000

### Data Layer
- **Primary DB:** PostgreSQL 15
- **Cache:** Redis 7
- **Container:** PostgreSQL 15-alpine, Redis 7-alpine
- **Volumes:** Named Docker volumes (data persistence)
- **Backup:** Database auto-initialized on container start

### Infrastructure
- **Orchestration:** Docker Compose v3
- **Networking:** Named Docker network (veda-network)
- **OS Support:** Windows 11 (WSL2), Linux, macOS
- **Development:** Docker Desktop required

## 🚀 Quick Start (Docker)

### Prerequisites

**System Requirements:**
- Windows 11 with WSL2 enabled
- Docker Desktop for Windows
- 8GB RAM minimum (16GB recommended)
- 20GB free disk space

**Software to Install:**
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (includes Docker Engine & Docker Compose)
- Git for Windows

### One-Command Startup

```powershell
# Navigate to project directory
cd Veda-Jothidam-Software

# Start all services with Docker Compose
docker-compose up -d

# View live logs
docker-compose logs -f
```

**That's it!** All 4 services start automatically:
- ✅ PostgreSQL database
- ✅ Redis cache
- ✅ Flask backend API
- ✅ Vanilla JS frontend

### Access the Application

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | http://localhost:3000 | Main UI |
| **Backend API** | http://localhost:5000/api | REST API |
| **Health Check** | http://localhost:5000/api/health | Backend status |
| **Database** | localhost:5432 | PostgreSQL |
| **Cache** | localhost:6379 | Redis |

### Verify Everything Works

```bash
# Check all containers are healthy
docker-compose ps

# Should show:
# - db (PostgreSQL) - healthy
# - redis - healthy
# - backend (Flask) - healthy  
# - frontend (http-server) - healthy

# Test backend API
curl http://localhost:5000/api/health
# Response: {"status": "OK", "message": "Veda Jothidam Backend is running", "version": "1.0.0"}

# Test frontend
curl http://localhost:3000
# Response: Frontend HTML content
```

### Useful Docker Commands

```bash
# Stop all services (keep data)
docker-compose down

# Stop and delete all data (reset)
docker-compose down -v

# View logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db

# Rebuild containers
docker-compose build --no-cache

# Access backend shell
docker-compose exec backend sh

# Access database shell
docker-compose exec db psql -U veda_user -d veda_jothidam
```

## 📚 Documentation

### Local Development Documentation
- **[README.md](./README.md)** (this file) - Getting started with Docker
- **[.env](./env.example)** - Environment variable configuration template

### Configuration Files
- **[docker-compose.yml](./docker-compose.yml)** - Container orchestration
- **[Dockerfile.backend](./Dockerfile.backend)** - Flask backend container
- **[Dockerfile.frontend](./Dockerfile.frontend)** - http-server frontend container

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens:** Access tokens (15-minute expiration) + Refresh tokens (7-day expiration)
- **Token Blacklist:** Automatic revocation on logout
- **Password Security:** bcrypt hashing with salt
- **Authorization:** JWT-based access control on protected endpoints

### API Security
- **CORS Protection:** Whitelist-based cross-origin requests
- **Content-Type Validation:** Enforces application/json for POST/PUT requests
- **Rate Limiting:** Configurable per endpoint
- **Input Validation:** Request validation framework

### Security Headers
- `X-Content-Type-Options: nosniff` - Prevent MIME type sniffing
- `X-Frame-Options: DENY` - Prevent clickjacking
- `X-XSS-Protection: 1; mode=block` - Legacy XSS protection
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy` - Restrict content sources
- `Permissions-Policy` - Control browser features
- `Strict-Transport-Security` - Force HTTPS (production)

### Database Security
- SQLAlchemy ORM prevents SQL injection
- Parameterized queries throughout
- Environment-based configuration (no secrets in code)
- Password protected database access

### Local Development Note
⚠️ **Development Credentials:** Default .env file uses simple credentials for local testing.
For production deployment, change all credentials and enable additional security measures.

## 🧪 Testing & Verification

### Health Checks

**Automated (Built-in Docker Health Checks):**
```bash
# All services have health checks that run every 30 seconds
docker-compose ps

# Healthy = Service is operational
# Unhealthy = Review logs for errors
```

### Manual Testing

**1. Backend API Health**
```bash
curl http://localhost:5000/api/health

# Expected response:
# {
#   "status": "OK",
#   "message": "Veda Jothidam Backend is running",
#   "version": "1.0.0"
# }
```

**2. Frontend Access**
```bash
curl http://localhost:3000

# Should return HTML content of the frontend
```

**3. Database Connection**
```bash
# From inside container
docker-compose exec db psql -U veda_user -d veda_jothidam -c "SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'public';"
```

**4. Redis Cache**
```bash
docker-compose exec redis redis-cli ping
# Expected: PONG
```

### Troubleshooting Tests

**Backend Logs:**
```bash
docker-compose logs backend --tail=100
```

**Database Logs:**
```bash
docker-compose logs db --tail=100
```

**Frontend Logs:**
```bash
docker-compose logs frontend --tail=100
```

**Full System Logs:**
```bash
docker-compose logs --all
```

## 📡 API Endpoints (REST)

### Status Endpoints
- `GET /api/health` - Backend health check
- `GET /api/config` - Configuration (dev mode only)

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login with JWT
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout and blacklist token

### Chart Management Endpoints
- `POST /api/charts` - Create new birth chart
- `GET /api/charts` - List all user charts
- `GET /api/charts/<chart_id>` - Get chart details
- `PUT /api/charts/<chart_id>` - Update chart
- `DELETE /api/charts/<chart_id>` - Delete chart

### Consultation Endpoints
- `POST /api/consultations` - Book consultation
- `GET /api/consultations` - List consultations
- `GET /api/consultations/<id>` - Get consultation details

### Sample API Test

```bash
# 1. Check backend is running
curl -X GET http://localhost:5000/api/health

# 2. Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "securepass123",
    "name": "Test User"
  }'

# 3. Login and get JWT token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "securepass123"
  }'

# Response will include:
# {
#   "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
#   "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
#   "token_type": "Bearer"
# }

# 4. Use access_token for authenticated requests
curl -X POST http://localhost:5000/api/charts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "name": "My Birth Chart",
    "birth_date": "1990-05-15",
    "birth_time": "14:30:00",
    "birth_place": "New York"
  }'
```

## 📈 Performance

### Current Configuration
```
Backend Gunicorn:      4 workers × 2 threads (8 concurrent requests)
Frontend:              http-server with gzip compression enabled
Database:              PostgreSQL 15 with optimized connections
Cache:                 Redis 7 for session & token management
Container Limits:      No strict memory limits (uses host resources)

API Response Time:     <500ms (typical)
Database Query Time:   <100ms (typical)
Frontend Load Time:    <1s (http-server)
Health Check Interval: 30 seconds per service
```

### Scaling for Production
For production deployment, consider:
- Horizontal scaling with Kubernetes
- Load balancing with Nginx
- Database connection pooling
- Redis cluster for session replication
- CDN for frontend assets

## 📊 Project Status

### Current Deployment
```
Status:                ✅ Fully Operational (Local Docker)
Services Running:      4/4 (Frontend, Backend, PostgreSQL, Redis)
All Containers:        ✅ Healthy
Health Checks:         ✅ Passing
Database:              ✅ Connected & Ready
Authentication:        ✅ JWT Configured
API Response:          ✅ Responding normally
```

### Code Structure
```
Backend (Flask):
├─ app.py             - Flask factory function
├─ wsgi.py            - Gunicorn entry point
├─ database.py        - SQLAlchemy configuration
├─ security_headers.py - Security middleware
├─ config.py          - Environment configuration
├─ jwt_handler.py     - JWT authentication
├─ routes/            - API blueprints
├─ models/            - SQLAlchemy models
├─ services/          - Business logic
└─ requirements.txt    - Python dependencies

Frontend:
├─ index.html         - Main HTML template
├─ styles.css         - Styling
└─ script.js          - JavaScript logic

Docker:
├─ docker-compose.yml  - Service orchestration
├─ Dockerfile.backend  - Flask container definition
└─ Dockerfile.frontend - http-server container definition

Configuration:
├─ .env               - Environment variables
└─ README.md          - This file
```

## 🚀 Deployment

### Local Development (Current)
Already fully set up with Docker! Just run:
```bash
docker-compose up -d
```

### Production Deployment Checklist

For moving to production, you'll need to:

1. **Update Environment Variables (.env)**
   ```env
   FLASK_ENV=production
   FLASK_DEBUG=False
   DEBUG=False
   JWT_SECRET_KEY=<generate-strong-random-key>
   DATABASE_URL=postgresql://prod_user:strong_password@prod-db-host:5432/veda_jothidam
   FRONTEND_URL=https://yourdomain.com
   BACKEND_URL=https://yourdomain.com/api
   ```

2. **Database Setup**
   - Use managed PostgreSQL service (AWS RDS, Google Cloud SQL, etc.)
   - Enable SSL/TLS connections
   - Configure automated backups
   - Setup connection pooling

3. **Security Hardening**
   - Change all default credentials
   - Enable HTTPS/SSL certificates (Let's Encrypt)
   - Configure Nginx reverse proxy
   - Enable CORS for specific domains only
   - Setup Web Application Firewall (WAF)

4. **Infrastructure**
   - Deploy to cloud platform (AWS, Google Cloud, DigitalOcean, etc.)
   - Configure CI/CD pipeline (GitHub Actions, etc.)
   - Setup monitoring and alerts (Datadog, New Relic, etc.)
   - Configure log aggregation (CloudWatch, ELK, etc.)

5. **Docker Compose (Production)**
   ```bash
   docker-compose -f docker-compose.yml up -d
   # Add health monitoring
   # Configure auto-restart policies
   # Setup log rotation
   ```

6. **Nginx Configuration** (Optional - for advanced setup)
   - SSL/TLS termination
   - Reverse proxy to backend
   - Static file serving optimization
   - Compression and caching headers

### Managed Database Services
Recommended for production:
- **AWS RDS** - PostgreSQL managed service
- **Google Cloud SQL** - Fully managed PostgreSQL
- **DigitalOcean Managed Databases** - PostgreSQL with backups
- **Azure Database for PostgreSQL** - Microsoft managed service

## 📋 System Requirements

### For Local Development (Docker)

**Windows 11:**
- WSL2 (Windows Subsystem for Linux 2)
- Docker Desktop for Windows (includes Docker Engine + Docker Compose)
- 8GB RAM minimum (16GB recommended for smooth development)
- 20GB free disk space
- PowerShell 5.1+ (included with Windows 11)

**Linux/macOS:**
- Docker Engine 20.10+
- Docker Compose 1.29+
- 4GB RAM minimum (8GB recommended)
- 20GB free disk space

**Verify Installation:**
```bash
docker --version        # Should show Docker version
docker-compose --version  # Should show Docker Compose version
```

### For Production Deployment

**Server OS:**
- Linux (Ubuntu 20.04 LTS recommended)
- AWS EC2, Google Cloud Compute, DigitalOcean, or equivalent
- Managed Kubernetes cluster (optional)

**Server Specs:**
- CPU: 2+ cores (4+ recommended for high traffic)
- RAM: 4GB minimum (8GB+ recommended)
- Storage: 40GB+ SSD
- Network: Stable internet connection

**Additional Services:**
- Managed PostgreSQL database (AWS RDS, Google Cloud SQL, etc.)
- Redis managed service (optional, for session clustering)
- CDN for static assets (CloudFlare, Cloudfront, etc.)
- Email service (SMTP or SendGrid) for notifications

## 🛠️ Development Workflow

### Making Changes

1. **Stop the current deployment** (if running):
   ```bash
   docker-compose down
   ```

2. **Make your code changes** in the project files

3. **Rebuild and restart**:
   ```bash
   docker-compose build --no-cache
   docker-compose up -d
   ```

4. **Verify changes**:
   ```bash
   docker-compose logs backend  # Check backend logs
   curl http://localhost:5000/api/health  # Test backend
   ```

### Common Development Tasks

**Add Python dependency:**
1. Edit `backend/requirements.txt`
2. Rebuild: `docker-compose build backend`
3. Restart: `docker-compose up -d backend`

**Modify frontend files:**
1. Edit files in `frontend/` directory
2. Changes reload automatically (http-server)
3. No rebuild needed (vanilla JS)

**Reset database:**
```bash
docker-compose down -v
docker-compose up -d
```

**Debug backend issues:**
```bash
docker-compose exec backend sh
# Inside container, you can run Python commands
python -c "import app; print('Flask loaded')"
```

## 📞 Troubleshooting

### Container Won't Start

**Check logs:**
```bash
docker-compose logs backend
docker-compose logs db
```

**Common Issues:**
- Port already in use: `netstat -ano | findstr :5000`
- Docker daemon not running: Start Docker Desktop
- Insufficient disk space: Free up 20GB+
- WSL2 not enabled: Run `wsl --install` in PowerShell

### Database Connection Issues

```bash
# Test database connection
docker-compose exec backend python -c "import database; print('DB OK')"

# Check if PostgreSQL is running
docker-compose ps db

# Reset database
docker-compose down -v
docker-compose up -d
```

### Frontend Not Loading

```bash
# Check frontend container
docker-compose logs frontend

# Test direct access
curl http://localhost:3000

# Verify http-server is running
docker-compose exec frontend ps aux
```

### Backend API Not Responding

```bash
# Check if backend container is healthy
docker-compose ps backend

# View backend error logs
docker-compose logs backend --tail=50

# Test Flask app directly
docker-compose exec backend python -c "from wsgi import app; print('WSGI OK')"
```

## 📝 Environment Configuration Reference

### Key Environment Variables

```env
# Flask Configuration
FLASK_ENV=development          # development or production
FLASK_DEBUG=True              # Enable debug mode
FLASK_APP=wsgi:app            # WSGI application

# Database Configuration  
DATABASE_URL=postgresql://...  # Connection string
DB_HOST=db                    # Database hostname
DB_PORT=5432                  # Database port
DB_NAME=veda_jothidam         # Database name
DB_USER=veda_user             # Database user
DB_PASSWORD=...               # Database password

# Cache Configuration
REDIS_URL=redis://redis:6379/0  # Redis connection

# JWT Configuration
JWT_SECRET_KEY=...            # Change in production!
JWT_ALGORITHM=HS256           # Signing algorithm
JWT_EXPIRATION_HOURS=24       # Token lifetime

# Service URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# Environment
ENVIRONMENT=development       # development or production
DEBUG=True                    # Enable debug mode
```

## 📄 License

Proprietary Software - All rights reserved

## 🎉 Status

```
Local Development:   ✅ Complete & Operational
Docker Setup:        ✅ All 4 Services Running Healthy
Database:            ✅ PostgreSQL 15 Ready
API:                 ✅ JWT Authentication Working
Frontend:            ✅ Serving Static Files
Testing:             ✅ Health Checks Passing
Documentation:       ✅ Complete
Production Ready:    🟡 Ready (with env changes)
```

---

**Last Updated:** September 15, 2026  
**Version:** 1.0.0-local-docker  
**Status:** Fully Operational  
**Containers:** 4/4 Healthy ✅
