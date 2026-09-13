-- Veda Jothidam Database Schema
-- Created: 2026-09-16
-- Version: 1.0

-- =====================================================
-- TABLE: users
-- Description: User accounts for the platform
-- =====================================================

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- =====================================================
-- TABLE: charts
-- Description: Birth charts and astrological data
-- =====================================================

CREATE TABLE IF NOT EXISTS charts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Chart metadata
    name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    birth_time TIME NOT NULL,
    birth_location VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    timezone VARCHAR(50) NOT NULL DEFAULT 'Asia/Kolkata',

    -- Chart system settings
    ayanamsa VARCHAR(50) DEFAULT 'lahiri',
    node_type VARCHAR(50) DEFAULT 'mean',

    -- Chart calculations (stored as JSON)
    d1_data JSONB,                    -- D1 Rasi chart data
    dasha_data JSONB,                 -- Vimshottari dasha periods
    planetary_strength JSONB,          -- Planetary strength (Grahapalam)
    house_strength JSONB,              -- House strength (Bhavapalam)

    -- Audit fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    UNIQUE(user_id, name)
);

-- Indexes for charts
CREATE INDEX IF NOT EXISTS idx_charts_user_id ON charts(user_id);
CREATE INDEX IF NOT EXISTS idx_charts_created_at ON charts(created_at);
CREATE INDEX IF NOT EXISTS idx_charts_birth_date ON charts(birth_date);
CREATE INDEX IF NOT EXISTS idx_charts_name ON charts(name);

-- =====================================================
-- TABLE: consultations
-- Description: Consultation records linked to charts
-- =====================================================

CREATE TABLE IF NOT EXISTS consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chart_id UUID NOT NULL REFERENCES charts(id) ON DELETE CASCADE,

    -- Consultation details
    consultation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    recommendations TEXT,
    remedies TEXT,
    follow_up_date DATE,

    -- Audit fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for consultations
CREATE INDEX IF NOT EXISTS idx_consultations_chart_id ON consultations(chart_id);
CREATE INDEX IF NOT EXISTS idx_consultations_date ON consultations(consultation_date);
CREATE INDEX IF NOT EXISTS idx_consultations_followup ON consultations(follow_up_date);

-- =====================================================
-- Verify tables created
-- =====================================================

-- Run this to verify:
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public';
