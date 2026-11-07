# Vedic Astrology Platform - Deployment Guide

**Version:** 1.0  
**Last Updated:** 2026-09-14  
**Status:** Production Ready

---

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Development Deployment](#development-deployment)
4. [Production Deployment](#production-deployment)
5. [Docker Deployment](#docker-deployment)
6. [Monitoring & Maintenance](#monitoring--maintenance)
7. [Troubleshooting](#troubleshooting)

---

## System Requirements

### Server Requirements
- **OS:** Linux (Ubuntu 20.04+), Windows Server 2019+, or macOS 11+
- **CPU:** Minimum 2 cores (4+ cores recommended)
- **RAM:** Minimum 4GB (8GB+ recommended)
- **Storage:** Minimum 20GB SSD (100GB+ for production)
- **Network:** 1Gbps connection (dedicated IP recommended)

### Software Requirements

**Backend:**
- Python 3.9+
- PostgreSQL 12+ (or SQLite for development)
- Node.js 16+ (for build tools)
- npm 8+

**Frontend:**
- Node.js 16+
- npm 8+
- Modern browser (Chrome, Firefox, Safari, Edge)

### Optional Services
- Redis 6+ (for enhanced caching and rate limiting)
- Sentry (for error tracking)
- New Relic (for performance monitoring)
- Datadog (for comprehensive monitoring)

---

## Pre-Deployment Checklist

### Security ✅
- [ ] All environment variables set securely
- [ ] `JWT_SECRET_KEY` is a strong random value (32+ characters)
- [ ] Database credentials stored securely (not in code)
- [ ] HTTPS/TLS certificate installed
- [ ] Firewall configured to allow only necessary ports
- [ ] SSH keys configured for server access
- [ ] No debug mode enabled in production
- [ ] All secrets removed from version control

### Database ✅
- [ ] PostgreSQL installed and running
- [ ] Database created
- [ ] Migration scripts prepared
- [ ] Database backups configured
- [ ] Connection pooling configured
- [ ] Indexes created
- [ ] Test data loaded (if needed)

### Code ✅
- [ ] All tests passing (100%)
- [ ] No security vulnerabilities (npm audit, pip audit)
- [ ] Build process tested
- [ ] Environment-specific configs created
- [ ] Error logging configured
- [ ] Performance optimization complete
- [ ] Code reviewed and approved

### Infrastructure ✅
- [ ] Server provisioned and secured
- [ ] Load balancer configured (if multi-server)
- [ ] CDN configured (if needed)
- [ ] DNS configured
- [ ] SSL/TLS certificate issued
- [ ] Firewall rules configured
- [ ] Rate limiting configured
- [ ] DDoS protection enabled (if available)

### Monitoring ✅
- [ ] Log aggregation configured
- [ ] Error tracking (Sentry) configured
- [ ] Performance monitoring (APM) configured
- [ ] Uptime monitoring configured
- [ ] Alert rules created
- [ ] Dashboard created
- [ ] Runbook prepared

---

## Development Deployment

### Quick Start (Local Development)

**1. Clone Repository**
```bash
git clone https://github.com/your-org/vedic-astrology.git
cd vedic-astrology
```

**2. Install Dependencies**

Backend:
```bash
cd backend
pip install -r requirements.txt
```

Frontend:
```bash
cd ..
npm install
```

**3. Setup Environment**
```bash
cp backend/.env.example .env
# Edit .env with development settings
```

**Development Environment Example:**
```
FLASK_ENV=development
DATABASE_URL=sqlite:///dev.db
JWT_SECRET_KEY=dev-secret-key-change-in-production
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5000
DEBUG=true
```

**4. Initialize Database**
```bash
cd backend
python -c "from backend.app import create_app; app = create_app(); app.app_context().push()"
```

**5. Run Backend**
```bash
cd backend
python -m backend.run
# Server runs on http://localhost:5000
```

**6. Run Frontend** (in new terminal)
```bash
npm run dev
# Server runs on http://localhost:3000
```

**7. Access Application**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health

---

## Production Deployment

### 1. Server Setup

**SSH into Server**
```bash
ssh -i /path/to/key.pem ubuntu@your-server-ip
```

**Update System**
```bash
sudo apt update
sudo apt upgrade -y
```

**Install Dependencies**
```bash
# Python
sudo apt install python3.9 python3.9-venv python3-pip -y

# PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install nodejs -y

# Other tools
sudo apt install git curl wget nginx supervisor -y
```

### 2. Database Setup

**Create PostgreSQL Database**
```bash
sudo -u postgres psql

# In PostgreSQL prompt:
CREATE DATABASE vedic_astrology;
CREATE USER vedic_user WITH PASSWORD 'strong_password_here';
ALTER ROLE vedic_user SET client_encoding TO 'utf8';
ALTER ROLE vedic_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE vedic_user SET default_transaction_deferrable TO ON;
ALTER ROLE vedic_user SET default_transaction_deferrable TO ON;
ALTER ROLE vedic_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE vedic_astrology TO vedic_user;
\q
```

**Test Connection**
```bash
psql -U vedic_user -d vedic_astrology -h localhost
```

### 3. Application Deployment

**Clone Repository**
```bash
cd /opt
sudo git clone https://github.com/your-org/vedic-astrology.git
sudo chown -R ubuntu:ubuntu vedic-astrology
cd vedic-astrology
```

**Create Python Virtual Environment**
```bash
python3.9 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r backend/requirements.txt
```

**Setup Environment Variables**
```bash
cp backend/.env.example .env
nano .env  # Edit with production values
```

**Production Environment Example:**
```
FLASK_ENV=production
DATABASE_URL=postgresql://vedic_user:password@localhost:5432/vedic_astrology
JWT_SECRET_KEY=<generate with: python -c "import secrets; print(secrets.token_urlsafe(32))">
ALLOWED_ORIGINS=https://vedic-astrology.com,https://www.vedic-astrology.com
DEBUG=false
SECURE_COOKIES=true
LOG_LEVEL=INFO
LOG_FILE=/var/log/vedic-astrology/app.log
```

**Build Frontend**
```bash
npm install
npm run build
```

**Create Systemd Service for Backend**
```bash
sudo nano /etc/systemd/system/vedic-astrology.service
```

**Service File Content:**
```ini
[Unit]
Description=Vedic Astrology Backend
After=network.target postgresql.service
Wants=postgresql.service

[Service]
User=ubuntu
WorkingDirectory=/opt/vedic-astrology
Environment="PATH=/opt/vedic-astrology/venv/bin"
ExecStart=/opt/vedic-astrology/venv/bin/python -m backend.run
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**Enable and Start Service**
```bash
sudo systemctl daemon-reload
sudo systemctl enable vedic-astrology
sudo systemctl start vedic-astrology
sudo systemctl status vedic-astrology
```

### 4. Nginx Configuration

**Create Nginx Config**
```bash
sudo nano /etc/nginx/sites-available/vedic-astrology
```

**Config Content:**
```nginx
upstream vedic_backend {
    server localhost:5000;
}

server {
    listen 80;
    server_name vedic-astrology.com www.vedic-astrology.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name vedic-astrology.com www.vedic-astrology.com;

    ssl_certificate /etc/ssl/certs/vedic-astrology.crt;
    ssl_certificate_key /etc/ssl/private/vedic-astrology.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    client_max_body_size 10M;

    location / {
        proxy_pass http://vedic_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }

    location /static/ {
        alias /opt/vedic-astrology/dist/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    error_page 404 /index.html;
}
```

**Enable Nginx Site**
```bash
sudo ln -s /etc/nginx/sites-available/vedic-astrology /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. SSL Certificate (Let's Encrypt)

**Install Certbot**
```bash
sudo apt install certbot python3-certbot-nginx -y
```

**Get Certificate**
```bash
sudo certbot certonly --nginx -d vedic-astrology.com -d www.vedic-astrology.com
```

**Auto-Renewal**
```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### 6. Firewall Configuration

**Configure UFW**
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 7. Monitoring & Logging

**Create Log Directory**
```bash
sudo mkdir -p /var/log/vedic-astrology
sudo chown ubuntu:ubuntu /var/log/vedic-astrology
sudo chmod 755 /var/log/vedic-astrology
```

**Setup Log Rotation**
```bash
sudo nano /etc/logrotate.d/vedic-astrology
```

**Config Content:**
```
/var/log/vedic-astrology/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 ubuntu ubuntu
    sharedscripts
    postrotate
        systemctl reload vedic-astrology > /dev/null 2>&1 || true
    endscript
}
```

---

## Docker Deployment

### 1. Create Dockerfile

**Backend Dockerfile**
```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Set environment variables
ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/api/health || exit 1

# Run application
CMD ["python", "-m", "backend.run"]
```

**Frontend Dockerfile**
```dockerfile
FROM node:16-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:16-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm install --production

EXPOSE 3000

CMD ["npm", "start"]
```

### 2. Docker Compose

**docker-compose.yml**
```yaml
version: '3.8'

services:
  db:
    image: postgres:13
    environment:
      POSTGRES_DB: vedic_astrology
      POSTGRES_USER: vedic_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    environment:
      DATABASE_URL: postgresql://vedic_user:secure_password@db:5432/vedic_astrology
      FLASK_ENV: production
      JWT_SECRET_KEY: ${JWT_SECRET_KEY}
    ports:
      - "5000:5000"
    depends_on:
      - db
    volumes:
      - ./backend:/app/backend

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:3000"
    environment:
      REACT_APP_API_URL: http://backend:5000/api
    depends_on:
      - backend

volumes:
  postgres_data:
```

**Deploy with Docker Compose**
```bash
docker-compose up -d
```

---

## Monitoring & Maintenance

### Health Checks

**API Health Check**
```bash
curl https://vedic-astrology.com/api/health
```

**Database Health**
```bash
psql -U vedic_user -d vedic_astrology -c "SELECT 1;"
```

### Log Monitoring

**View Recent Logs**
```bash
journalctl -u vedic-astrology -n 100 -f
```

**Check Error Logs**
```bash
tail -f /var/log/vedic-astrology/app.log | grep ERROR
```

### Database Maintenance

**Backup Database**
```bash
pg_dump -U vedic_user vedic_astrology > backup-$(date +%Y%m%d-%H%M%S).sql
```

**Restore Database**
```bash
psql -U vedic_user vedic_astrology < backup.sql
```

### Performance Monitoring

**Monitor System Resources**
```bash
top
ps aux | grep vedic-astrology
df -h
```

---

## Troubleshooting

### Common Issues & Solutions

**1. Database Connection Error**
```
Error: could not connect to server
Solution:
- Check PostgreSQL is running: sudo systemctl status postgresql
- Verify DATABASE_URL in .env
- Check credentials
```

**2. Port Already in Use**
```
Error: Address already in use
Solution:
- Find process: lsof -i :5000
- Kill process: kill -9 <PID>
- Or change port in configuration
```

**3. Permission Denied**
```
Error: Permission denied when writing to log file
Solution:
- Check log directory permissions: ls -la /var/log/vedic-astrology/
- Fix permissions: sudo chown ubuntu:ubuntu /var/log/vedic-astrology/
```

**4. SSL Certificate Error**
```
Error: SSL certificate not found
Solution:
- Verify certificate path in nginx config
- Renew certificate: sudo certbot renew --force-renewal
- Check certificate expiration: openssl x509 -enddate -noout -in cert.pem
```

**5. High Memory Usage**
```
Solution:
- Monitor with: top
- Check for memory leaks
- Restart service: sudo systemctl restart vedic-astrology
- Configure memory limits in systemd
```

---

## Performance Optimization

### Database Optimization
```sql
-- Create indexes
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_chart_user_id ON charts(user_id);
CREATE INDEX idx_token_jti ON token_blacklist(token_jti);
```

### Caching Strategy
- Use Redis for session caching
- Cache API responses (5-10 minutes)
- Cache static assets (30 days)

### Load Testing
```bash
# Using Apache Bench
ab -n 1000 -c 10 https://vedic-astrology.com/api/health

# Using wrk
wrk -t4 -c100 -d30s https://vedic-astrology.com/api/health
```

---

## Rollback Procedures

**In Case of Issues:**
```bash
# View recent commits
git log --oneline -10

# Revert to previous version
git checkout <commit-hash>
cd backend && pip install -r requirements.txt
npm install && npm run build

# Restart service
sudo systemctl restart vedic-astrology
```

---

## Maintenance Schedule

- **Daily:** Check logs, monitor resources
- **Weekly:** Database backup verification
- **Monthly:** Security updates, performance review
- **Quarterly:** Full security audit, capacity planning

---

**Status: Production Ready ✅**

For support, refer to the User Manual and API Documentation.

