-- ==============================================
-- UNLEASH Cosmetics - Database Setup
-- ==============================================

-- Step 1: Create the database
CREATE DATABASE unleash;

-- Step 2: Use this database
USE unleash;

-- Step 3: Create users table for customer login/signup
-- Stores all registered customer information

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,      -- Unique ID for each user (auto increases)
    fullname VARCHAR(100),                  -- Customer's full name
    email VARCHAR(100) UNIQUE,              -- Email address (must be unique, used for login)
    password VARCHAR(255),                  -- Hashed password (secure, not plain text)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Automatically stores signup date/time
);

-- ==============================================
-- HOW TO USE:
-- 1. Open phpMyAdmin
-- 2. Click on SQL tab
-- 3. Paste this entire code
-- 4. Click "Go" button
-- ==============================================

-- Your database is now ready!
-- New users can signup via the website
-- They will be automatically added to this table
