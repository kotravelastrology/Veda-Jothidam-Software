# Veda Jothidam Database Setup Guide

**Date:** 2026-09-16  
**Version:** 1.0  
**Status:** Ready for Implementation

---

## 📋 Overview

This guide provides step-by-step instructions for setting up the PostgreSQL database for the Veda Jothidam platform.

### Database Information
- **DBMS:** PostgreSQL 12+
- **Database Name:** vedic_astrology
- **Schema Version:** 1.0
- **Tables:** 3 (users, charts, consultations)

---

## 🛠️ Prerequisites

### Windows Installation

#### 1. Install PostgreSQL

**Option A: Using Windows Installer (Recommended)**
```
1. Download from: https://www.postgresql.org/download/windows/
2. Run installer (PostgreSQL 14 or 15)
3. During installation:
   - Set password for 'postgres' user (remember this!)
   - Default port: 5432
   - Locale: English, United States
   - Components: Select all (PostgreSQL Server, pgAdmin, Command Line Tools)
```

**Option B: Using Chocolatey**
```powershell
choco install postgresql --params '/Password:YourPassword123'
```

#### 2. Verify Installation

```powershell
# Check PostgreSQL version
psql --version

# Test connection
psql -U postgres -h localhost -c "SELECT version();"
```

### macOS Installation

```bash
# Using Homebrew
brew install postgresql

# Start PostgreSQL
brew services start postgresql

# Test connection
psql postgres
```

### Linux (Ubuntu) Installation

```bash
# Install PostgreSQL
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql

# Test connection
sudo -u postgres psql
```

---

## 🔧 Database Setup Steps

### Step 1: Create Database User

```sql
-- Connect as postgres superuser first
-- Windows: psql -U postgres
-- macOS/Linux: sudo -u postgres psql

-- Create database user for application
CREATE USER vedic_user WITH PASSWORD 'your_secure_password_here';

-- Grant privileges
ALTER ROLE vedic_user CREATEDB;
ALTER ROLE vedic_user SUPERUSER;

-- Exit psql
\q
```

### Step 2: Set Environment Variable

**Windows (PowerShell):**
```powershell
[Environment]::SetEnvironmentVariable("DATABASE_URL", "postgresql://vedic_user:your_password@localhost:5432/vedic_astrology", "User")

# Restart PowerShell for changes to take effect
```

**Windows (Command Prompt):**
```cmd
setx DATABASE_URL "postgresql://vedic_user:your_password@localhost:5432/vedic_astrology"
```

**macOS/Linux (Bash):**
```bash
echo 'export DATABASE_URL="postgresql://vedic_user:your_password@localhost:5432/vedic_astrology"' >> ~/.bashrc
source ~/.bashrc
```

### Step 3: Verify Environment Variable

**Windows (PowerShell):**
```powershell
$env:DATABASE_URL
```

**macOS/Linux:**
```bash
echo $DATABASE_URL
```

### Step 4: Run Database Migrations

#### Option A: Using Python Migration Script (Recommended)

```bash
# Navigate to project directory
cd D:\KotravelAstrology\Veda-Jothidam-Software

# Install Python dependencies (if not already installed)
pip install psycopg2-binary

# Run full migration (creates DB + runs migrations + verifies)
python -m backend.migrations.migrate --action full

# Or run individual steps:
python -m backend.migrations.migrate --action create-db
python -m backend.migrations.migrate --action migrate
python -m backend.migrations.migrate --action verify
```

#### Option B: Using psql Directly

```bash
# Connect as postgres
psql -U postgres -h localhost

# In psql:
CREATE DATABASE vedic_astrology;
\c vedic_astrology

# Run migration file
\i backend/migrations/001_initial_schema.sql

# Verify tables
\dt

# Exit
\q
```

---

## ✅ Verification Checklist

After running migrations, verify everything is set up correctly:

### 1. Database Exists
```sql
psql -U vedic_user -d vedic_astrology -h localhost -c "\l"
```
Expected: Should show `vedic_astrology` database

### 2. Tables Created
```sql
psql -U vedic_user -d vedic_astrology -h localhost -c "\dt"
```
Expected output:
```
           List of relations
 Schema |      Name       | Type  | Owner
--------+-----------------+-------+-----------
 public | charts          | table | vedic_user
 public | consultations   | table | vedic_user
 public | users           | table | vedic_user
(3 rows)
```

### 3. Test Insert Operation
```sql
-- Connect to database
psql -U vedic_user -d vedic_astrology -h localhost

-- Test insert
INSERT INTO users (email, username, password_hash, full_name)
VALUES ('test@example.com', 'testuser', 'hash123', 'Test User');

-- Verify insert
SELECT * FROM users;

-- Clean up test data
DELETE FROM users WHERE email = 'test@example.com';
```

### 4. Test Database Connection from Python

```python
import psycopg2

try:
    conn = psycopg2.connect(
        host="localhost",
        database="vedic_astrology",
        user="vedic_user",
        password="your_password"
    )
    cur = conn.cursor()
    cur.execute("SELECT version();")
    print("✅ Connection successful!")
    print(f"PostgreSQL: {cur.fetchone()[0]}")
    cur.close()
    conn.close()
except Exception as e:
    print(f"❌ Connection failed: {e}")
```

---

## 📊 Database Schema Overview

### users table
```
Column        | Type      | Constraints
--------------+-----------+------------------
id            | UUID      | PRIMARY KEY
email         | VARCHAR   | UNIQUE, NOT NULL
username      | VARCHAR   | UNIQUE, NOT NULL
password_hash | VARCHAR   | NOT NULL
full_name     | VARCHAR   | 
phone         | VARCHAR   | 
city          | VARCHAR   | 
state         | VARCHAR   | 
country       | VARCHAR   | 
created_at    | TIMESTAMP | DEFAULT now()
updated_at    | TIMESTAMP | DEFAULT now()
is_active     | BOOLEAN   | DEFAULT true
```

### charts table
```
Column                | Type      | Constraints
----------------------+-----------+------------------
id                    | UUID      | PRIMARY KEY
user_id               | UUID      | FOREIGN KEY
name                  | VARCHAR   | NOT NULL
birth_date            | DATE      | NOT NULL
birth_time            | TIME      | NOT NULL
birth_location        | VARCHAR   | NOT NULL
latitude              | DECIMAL   | NOT NULL
longitude             | DECIMAL   | NOT NULL
timezone              | VARCHAR   | DEFAULT 'Asia/Kolkata'
ayanamsa              | VARCHAR   | DEFAULT 'lahiri'
node_type             | VARCHAR   | DEFAULT 'mean'
d1_data               | JSONB     | 
dasha_data            | JSONB     | 
planetary_strength    | JSONB     | 
house_strength        | JSONB     | 
created_at            | TIMESTAMP | DEFAULT now()
updated_at            | TIMESTAMP | DEFAULT now()
```

### consultations table
```
Column              | Type      | Constraints
--------------------+-----------+------------------
id                  | UUID      | PRIMARY KEY
chart_id            | UUID      | FOREIGN KEY
consultation_date   | TIMESTAMP | DEFAULT now()
notes               | TEXT      | 
recommendations     | TEXT      | 
remedies            | TEXT      | 
follow_up_date      | DATE      | 
created_at          | TIMESTAMP | DEFAULT now()
updated_at          | TIMESTAMP | DEFAULT now()
```

---

## 🔐 Security Best Practices

### 1. Password Security
```sql
-- Use strong passwords (12+ characters with special characters)
-- Example: MySecure@Pass2026!

-- Never commit passwords to git
-- Store in .env file (which is in .gitignore)
```

### 2. User Permissions
```sql
-- Create read-only user (optional, for backups)
CREATE USER vedic_readonly WITH PASSWORD 'readonly_pass';
GRANT CONNECT ON DATABASE vedic_astrology TO vedic_readonly;
GRANT USAGE ON SCHEMA public TO vedic_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO vedic_readonly;
```

### 3. Backup User
```sql
-- Create backup user
CREATE USER vedic_backup WITH PASSWORD 'backup_pass';
GRANT CONNECT ON DATABASE vedic_astrology TO vedic_backup;
```

---

## 📦 Backup & Restore

### Create Backup
```bash
# Full database backup
pg_dump -U vedic_user -h localhost vedic_astrology > backup_$(date +%Y%m%d_%H%M%S).sql

# Custom format (recommended for large databases)
pg_dump -U vedic_user -h localhost -F c vedic_astrology > backup_$(date +%Y%m%d_%H%M%S).dump
```

### Restore from Backup
```bash
# From SQL backup
psql -U vedic_user -h localhost vedic_astrology < backup.sql

# From custom format
pg_restore -U vedic_user -h localhost -d vedic_astrology backup.dump
```

---

## 🐛 Troubleshooting

### Connection Refused
```
Error: could not connect to server: Connection refused
```

**Solution:**
1. Check if PostgreSQL is running
2. Verify DATABASE_URL is correct
3. Check PostgreSQL port (default: 5432)
4. Check firewall settings

### Password Authentication Failed
```
Error: password authentication failed for user "vedic_user"
```

**Solution:**
1. Verify password is correct
2. Reset password: `ALTER USER vedic_user WITH PASSWORD 'newpassword';`
3. Check .env file is using correct password

### Database Does Not Exist
```
Error: database "vedic_astrology" does not exist
```

**Solution:**
1. Run migration script again
2. Manually create: `CREATE DATABASE vedic_astrology;`
3. Re-run migrations

### Tables Not Found
```
Error: relation "users" does not exist
```

**Solution:**
1. Verify migrations ran successfully
2. Run: `python -m backend.migrations.migrate --action verify`
3. Re-run migrations if needed

---

## 📝 Task 1.1 Checklist

### Database Setup
- [ ] PostgreSQL installed (version 12+)
- [ ] Database user created (vedic_user)
- [ ] DATABASE_URL environment variable set
- [ ] Database created (vedic_astrology)
- [ ] Migration script created (001_initial_schema.sql)
- [ ] Migrations run successfully
- [ ] All 3 tables created
- [ ] All indexes created

### Verification
- [ ] Test connection successful
- [ ] Can insert test data
- [ ] Can query tables
- [ ] All columns present
- [ ] Foreign keys working
- [ ] Indexes created

### Documentation
- [ ] DATABASE_SETUP.md created
- [ ] Migration script documented
- [ ] Backup procedures documented
- [ ] Troubleshooting guide included

---

## ✨ Next Steps

After database setup is complete:
1. Proceed to Task 1.2 - Backend Data Models
2. Create SQLAlchemy models (User, Chart, Consultation)
3. Test model relationships

---

**Status:** ✅ Ready for Implementation  
**Created:** 2026-09-16  
**Last Updated:** 2026-09-16

