# Complete Production Deployment Guide - Veda Jothidam

**Project:** Veda Jothidam - Vedic Astrology SaaS Platform  
**Version:** 1.0.0  
**Last Updated:** September 15, 2026  
**Status:** ✅ Ready for Production  

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [Infrastructure Setup](#infrastructure-setup)
4. [Configuration](#configuration)
5. [Deployment Process](#deployment-process)
6. [Verification](#verification)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Troubleshooting](#troubleshooting)
9. [Rollback Procedures](#rollback-procedures)
10. [Security Best Practices](#security-best-practices)

---

## Architecture Overview

### Production Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Internet Users                           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    HTTPS (Port 443)
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    CloudFlare / WAF                              │
│              (DDoS Protection, Rate Limiting)                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    TCP Load Balancer
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼──────┐   ┌─────────▼──────┐   ┌────────▼──────┐
│  Frontend    │   │   Frontend     │   │   Frontend    │
│  Instance 1  │   │   Instance 2   │   │  Instance 3   │
│  (Nginx)     │   │   (Nginx)      │   │  (Nginx)      │
└───────┬──────┘   └────────┬───────┘   └────────┬──────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                    Reverse Proxy / Router
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼──────┐   ┌─────────▼──────┐   ┌────────▼──────┐
│  Backend     │   │   Backend      │   │   Backend    │
│  Instance 1  │   │   Instance 2   │   │  Instance 3  │
│  (Gunicorn)  │   │   (Gunicorn)   │   │  (Gunicorn)  │
└───────┬──────┘   └────────┬───────┘   └────────┬──────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                    Database Connection Pool
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        │                    │              ┌─────▼──────┐
        │                    │              │   Read     │
        │                    │              │  Replica   │
        │                    │              └────────────┘
        │                    │
    ┌───▼──────┐  ┌─────────▼──────┐
    │PostgreSQL│◄─┤  Redis Cluster │
    │ Primary  │  │ (Session Store)│
    └─────────┘  └────────────────┘
         │
    ┌────▼──────┐
    │  Backups  │
    │  (S3)     │
    └───────────┘
```

### Key Components

1. **Frontend:** Nginx reverse proxy + Vanilla JavaScript
2. **Backend:** Flask API with Gunicorn (multiple workers)
3. **Database:** Managed PostgreSQL with read replicas
4. **Cache:** Redis for session management
5. **Storage:** S3 for backups
6. **Monitoring:** DataDog / CloudWatch
7. **CDN:** CloudFlare for static assets
8. **SSL/TLS:** Let's Encrypt certificates

---

## Prerequisites

### Required Knowledge
- [ ] Docker and Docker Compose
- [ ] Linux/Unix command line
- [ ] SSH and basic networking
- [ ] PostgreSQL administration
- [ ] Git version control
- [ ] Python (basic understanding)

### Required Tools
- [ ] Docker 20.10+
- [ ] Docker Compose 2.0+
- [ ] Git 2.30+
- [ ] curl or wget for testing
- [ ] SSH client
- [ ] Text editor (VS Code, nano, vim)

### Cloud Accounts (Choose One)
- [ ] AWS Account (EC2, RDS, ElastiCache, S3)
- [ ] Google Cloud Account (Compute Engine, Cloud SQL, Memorystore)
- [ ] DigitalOcean Account (Droplet, Managed DB, Redis)
- [ ] Azure Account (VMs, Database, Cache)

### Domain Requirements
- [ ] Registered domain name
- [ ] DNS access to update records
- [ ] SSL certificate (free with Let's Encrypt)

---

## Infrastructure Setup

### Step 1: Select Hosting Provider

#### Recommended: AWS
```
EC2 Instance:        t3.medium (2 vCPU, 4GB RAM)
RDS Database:        db.t3.medium PostgreSQL 15
ElastiCache:         cache.t3.micro Redis 7
Auto Scaling Group:  2-4 instances
Load Balancer:       Application Load Balancer
```

#### Alternative: DigitalOcean
```
Droplet:             s-2vcpu-4gb (Backend)
Droplet:             s-2vcpu-4gb (Database)
Managed Database:    PostgreSQL 15
Managed Redis:       Redis 7
Load Balancer:       DigitalOcean Load Balancer
```

#### Alternative: Google Cloud
```
Compute Engine:      n1-standard-2
Cloud SQL:           PostgreSQL 15
Memorystore Redis:   Redis 7 (basic)
Cloud Load Balancer: HTTP(S) Load Balancer
```

### Step 2: Create Server Infrastructure

**For AWS:**
```bash
# Create EC2 instance
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t3.medium \
  --key-name your-key \
  --security-groups veda-prod-sg

# Create RDS database
aws rds create-db-instance \
  --db-instance-identifier veda-jothidam-prod \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --master-username prod_user \
  --master-user-password STRONG_PASSWORD \
  --allocated-storage 100

# Create ElastiCache
aws elasticache create-cache-cluster \
  --cache-cluster-id veda-redis-prod \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1
```

### Step 3: Configure Security Groups

**Inbound Rules:**
```
Port 22   (SSH)        - Restricted to admin IPs
Port 80   (HTTP)       - Allow from anywhere (redirect to 443)
Port 443  (HTTPS)      - Allow from anywhere
Port 5432 (PostgreSQL) - Allow from backend security group only
Port 6379 (Redis)      - Allow from backend security group only
```

**Outbound Rules:**
```
All traffic - Allow to anywhere
```

### Step 4: Install Docker

```bash
# Connect to server
ssh -i your-key.pem ubuntu@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
docker-compose --version
```

### Step 5: Set Up Directories

```bash
# Create application directory
sudo mkdir -p /opt/veda-jothidam
sudo chown -R $USER:$USER /opt/veda-jothidam

# Create log directory
sudo mkdir -p /var/log/veda-jothidam
sudo chown -R $USER:$USER /var/log/veda-jothidam

# Create backup directory
sudo mkdir -p /opt/backups
sudo chown -R $USER:$USER /opt/backups
```

---

## Configuration

### Step 1: Generate Secrets

```bash
# Generate JWT secret (64 chars minimum)
python3 -c "import secrets; print('JWT_SECRET_KEY=' + secrets.token_urlsafe(64))" >> secrets.txt

# Generate database password
python3 -c "import secrets; print('DB_PASSWORD=' + secrets.token_urlsafe(32))" >> secrets.txt

# Generate Redis password
python3 -c "import secrets; print('REDIS_PASSWORD=' + secrets.token_urlsafe(32))" >> secrets.txt

# Save to secure location
chmod 600 secrets.txt
```

### Step 2: Create Environment Configuration

```bash
# Copy template
cp .env.production.example .env.production

# Edit configuration
nano .env.production
```

**Key variables to update:**
```env
# Database
DATABASE_URL=postgresql://prod_user:PASSWORD@prod-db.example.com:5432/veda_jothidam_prod

# Redis
REDIS_URL=redis://:PASSWORD@redis.example.com:6379/0

# JWT
JWT_SECRET_KEY=YOUR_GENERATED_SECRET_KEY

# URLs
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://yourdomain.com/api

# Email
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Monitoring
SENTRY_DSN=https://key@sentry.io/project
APM_ENABLED=True
```

### Step 3: Configure SSL/TLS

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Generate certificate
sudo certbot certonly --standalone \
  -d yourdomain.com \
  -d www.yourdomain.com \
  -m admin@yourdomain.com \
  --agree-tos

# Certificate location
ls -la /etc/letsencrypt/live/yourdomain.com/
```

### Step 4: Clone Repository

```bash
# Clone code
cd /opt/veda-jothidam
git clone https://github.com/your-org/veda-jothidam-software.git .

# Checkout production branch (if applicable)
git checkout main
```

### Step 5: Set Up Nginx Configuration

Create `/etc/nginx/sites-available/veda-jothidam`:

```nginx
upstream backend {
    server backend:5000 max_fails=3 fail_timeout=30s;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# Main HTTPS server
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/json;

    # Frontend static files
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }

    # API backend
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

Enable configuration:
```bash
sudo ln -s /etc/nginx/sites-available/veda-jothidam \
           /etc/nginx/sites-enabled/

sudo nginx -t
sudo systemctl restart nginx
```

---

## Deployment Process

### Step 1: Prepare Environment

```bash
cd /opt/veda-jothidam

# Verify environment file
cat .env.production | head -20

# Set permissions
chmod 600 .env.production
```

### Step 2: Initialize Database

```bash
# Create database (if using managed service, skip this)
docker-compose -f docker-compose.production.yml exec db \
  psql -U postgres -c "CREATE DATABASE veda_jothidam_prod;"

# Run migrations (if any)
docker-compose -f docker-compose.production.yml exec backend \
  python -m flask db upgrade
```

### Step 3: Start Services

```bash
# Build images
docker-compose -f docker-compose.production.yml build

# Start services
docker-compose -f docker-compose.production.yml up -d

# Check status
docker-compose -f docker-compose.production.yml ps

# View logs
docker-compose -f docker-compose.production.yml logs -f
```

### Step 4: Verify Deployment

```bash
# Test health endpoint
curl -k https://yourdomain.com/api/health

# Test frontend
curl -k https://yourdomain.com | head -20

# Check service logs
docker-compose -f docker-compose.production.yml logs backend
```

---

## Verification

### Health Checks

```bash
# 1. Backend API
curl -s https://yourdomain.com/api/health | jq .

# 2. Database connectivity
docker-compose -f docker-compose.production.yml exec backend \
  python -c "from database import db; print('DB OK')"

# 3. Redis connectivity
docker-compose -f docker-compose.production.yml exec redis \
  redis-cli ping

# 4. Frontend loading
curl -s -I https://yourdomain.com | grep HTTP

# 5. SSL certificate
echo | openssl s_client -servername yourdomain.com -connect yourdomain.com:443
```

### Functional Tests

```bash
# 1. User registration (via API test page)
curl -X POST https://yourdomain.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"TestPass123!","full_name":"Test"}'

# 2. User login
curl -X POST https://yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"TestPass123!"}'

# 3. Create chart (requires auth token from login)
curl -X POST https://yourdomain.com/api/charts/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Test Chart","birth_date":"1990-01-01",...}'
```

---

## Monitoring & Maintenance

### Daily Tasks

```bash
# Check service status
docker-compose -f docker-compose.production.yml ps

# Review logs
docker-compose -f docker-compose.production.yml logs --since 1h

# Monitor resource usage
docker stats

# Check disk space
df -h /opt/veda-jothidam
df -h /var/log
```

### Weekly Tasks

```bash
# Database backup status
aws s3 ls s3://veda-jothidam-backups/

# Review error logs
grep ERROR /var/log/veda-jothidam/app.log | tail -20

# Check SSL certificate expiration
certbot certificates

# Monitor database performance
# Via AWS Console or managed service dashboard
```

### Monthly Tasks

```bash
# Update Docker images
docker-compose -f docker-compose.production.yml pull
docker-compose -f docker-compose.production.yml up -d

# Review and optimize database
# Run ANALYZE and VACUUM

# Check security patches
sudo apt list --upgradable

# Review monitoring trends
# Generate reports from monitoring dashboard
```

---

## Troubleshooting

### Service Won't Start

```bash
# Check logs
docker-compose -f docker-compose.production.yml logs

# Verify environment variables
grep -v '^#' .env.production | grep -v '^$'

# Check port availability
sudo netstat -tlnp | grep LISTEN

# Rebuild images
docker-compose -f docker-compose.production.yml build --no-cache
```

### Database Connection Error

```bash
# Test connection
docker-compose -f docker-compose.production.yml exec backend \
  psql -c "SELECT 1" -U prod_user -h db

# Check firewall
sudo ufw status

# Verify credentials in .env.production
grep DATABASE_URL .env.production
```

### High CPU/Memory Usage

```bash
# Monitor container
docker stats container-name

# Check running processes
docker-compose -f docker-compose.production.yml exec backend top

# Increase resources
# Edit docker-compose.production.yml and increase limits

# Restart service
docker-compose -f docker-compose.production.yml restart backend
```

### SSL Certificate Issues

```bash
# Check certificate validity
certbot certificates

# Renew certificate
sudo certbot renew --dry-run

# Verify Nginx has correct paths
grep ssl_certificate /etc/nginx/sites-available/veda-jothidam

# Reload Nginx
sudo systemctl reload nginx
```

---

## Rollback Procedures

### Quick Rollback

```bash
# 1. Stop services
docker-compose -f docker-compose.production.yml down

# 2. Checkout previous version
git log --oneline | head -10
git checkout <previous-hash>

# 3. Rebuild and restart
docker-compose -f docker-compose.production.yml build
docker-compose -f docker-compose.production.yml up -d

# 4. Verify
curl https://yourdomain.com/api/health
```

### Database Rollback

```bash
# 1. Restore from backup
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier veda-jothidam-prod \
  --db-snapshot-identifier veda-jothidam-prod-2026-09-15

# 2. Update connection string in .env.production

# 3. Restart backend
docker-compose -f docker-compose.production.yml restart backend
```

---

## Security Best Practices

### 1. Access Control
- [ ] Restrict SSH to specific IPs
- [ ] Use SSH key authentication (no passwords)
- [ ] Rotate keys regularly
- [ ] Use IAM roles instead of access keys (AWS)

### 2. Data Security
- [ ] Enable encryption at rest (database, Redis)
- [ ] Enable encryption in transit (TLS 1.2+)
- [ ] Use strong passwords (min 24 chars)
- [ ] Rotate secrets every 90 days

### 3. Application Security
- [ ] Keep Docker images updated
- [ ] Run containers as non-root user
- [ ] Use read-only filesystems where possible
- [ ] Enable security scanning (Trivy, Snyk)

### 4. Network Security
- [ ] Use VPC/Private networks
- [ ] Configure firewall rules
- [ ] Use VPN for admin access
- [ ] Enable DDoS protection (CloudFlare, AWS Shield)

### 5. Monitoring & Logging
- [ ] Centralize logs (CloudWatch, ELK)
- [ ] Monitor for suspicious activity
- [ ] Set up alerts for critical events
- [ ] Conduct regular security audits

---

## Support & Documentation

### Reference Documents
- [README.md](./README.md) - Project overview
- [API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md) - API reference
- [PRODUCTION_DEPLOYMENT_CHECKLIST.md](./PRODUCTION_DEPLOYMENT_CHECKLIST.md) - Checklist

### External Resources
- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)

### Getting Help
- Check application logs: `docker-compose logs`
- Review monitoring dashboard
- Contact support team
- File issues on GitHub

---

## Deployment Sign-Off

| Item | Status | Date |
|------|--------|------|
| Infrastructure Ready | ✅ | [DATE] |
| Configuration Complete | ✅ | [DATE] |
| Security Hardened | ✅ | [DATE] |
| Testing Passed | ✅ | [DATE] |
| Monitoring Configured | ✅ | [DATE] |
| **Ready for Production** | **✅** | **[DATE]** |

---

**Generated:** September 15, 2026  
**Version:** 1.0.0  
**Status:** ✅ **READY FOR DEPLOYMENT**
