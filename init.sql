-- Connect to the default Postgres container database
\c postgres;

-- Re-create banking_db cleanly
DROP DATABASE IF EXISTS banking_db;
CREATE DATABASE banking_db;

-- Switch to banking_db
\c banking_db;

-------------------------------------------------------------------------------
-- 1. AUTH / USERS TABLE
-------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
                                     id BIGSERIAL PRIMARY KEY,
                                     username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'ROLE_USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-------------------------------------------------------------------------------
-- 2. ACCOUNTS TABLE
-------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS accounts (
                                        id BIGSERIAL PRIMARY KEY,
                                        user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    account_type VARCHAR(20) DEFAULT 'CHECKING',
    balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-------------------------------------------------------------------------------
-- 3. TRANSACTIONS TABLE
-------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transactions (
                                            id BIGSERIAL PRIMARY KEY,
                                            transaction_id VARCHAR(36) UNIQUE NOT NULL,
    account_number VARCHAR(20) REFERENCES accounts(account_number),
    amount NUMERIC(15, 2) NOT NULL,
    transaction_type VARCHAR(20) NOT NULL, -- DEPOSIT, WITHDRAWAL, TRANSFER
    status VARCHAR(20) NOT NULL DEFAULT 'COMPLETED',
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-------------------------------------------------------------------------------
-- 4. TRANSFERS / PAYMENTS TABLE
-------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transfers (
                                         id BIGSERIAL PRIMARY KEY,
                                         transfer_reference VARCHAR(36) UNIQUE NOT NULL,
    source_account_number VARCHAR(20) NOT NULL,
    destination_account_number VARCHAR(20) NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'INITIATED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );