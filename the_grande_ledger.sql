CREATE DATABASE OODO;
USE OODO;

CREATE TABLE companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country_code VARCHAR(10),
    currency_code VARCHAR(10),
    currency_symbol VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'employee') NOT NULL,
    manager_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (manager_id) REFERENCES users(id)
);

CREATE TABLE receipts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uploaded_by INT NOT NULL,
    file_path VARCHAR(500),
    file_type VARCHAR(50),
    ocr_status ENUM('pending', 'processing', 'done', 'failed') DEFAULT 'pending',
    ocr_raw_text TEXT,
    parsed_amount FLOAT,
    parsed_currency VARCHAR(10),
    parsed_description VARCHAR(500),
    parsed_category VARCHAR(100),
    parsed_date DATE,
    parsed_vendor VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    submitted_by INT NOT NULL,
    receipt_id INT,
    description VARCHAR(500),
    category VARCHAR(100),
    amount FLOAT NOT NULL,
    currency_code VARCHAR(10),
    amount_in_company_currency FLOAT,
    expense_date DATE,
    status ENUM('draft', 'pending', 'approved', 'rejected') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (submitted_by) REFERENCES users(id),
    FOREIGN KEY (receipt_id) REFERENCES receipts(id)
);
CREATE TABLE approval_rules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    name VARCHAR(255),
    category VARCHAR(100),
    min_amount FLOAT,
    max_amount FLOAT,
    is_manager_approver BOOLEAN DEFAULT FALSE,
    condition_type ENUM('sequential', 'percentage', 'key_approver', 'hybrid'),
    percentage_threshold FLOAT,
    key_approver_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (key_approver_id) REFERENCES users(id)
);

CREATE TABLE approval_rule_approvers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rule_id INT NOT NULL,
    user_id INT NOT NULL,
    sequence_order INT NOT NULL,
    FOREIGN KEY (rule_id) REFERENCES approval_rules(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE approval_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    expense_id INT NOT NULL,
    rule_id INT NOT NULL,
    approver_id INT NOT NULL,
    sequence_order INT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    comment TEXT,
    responded_at TIMESTAMP,
    FOREIGN KEY (expense_id) REFERENCES expenses(id),
    FOREIGN KEY (rule_id) REFERENCES approval_rules(id),
    FOREIGN KEY (approver_id) REFERENCES users(id)
);

CREATE TABLE audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    detail TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE auth_security (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP NULL,
    session_token VARCHAR(255),
    session_expires_at TIMESTAMP NULL,
    session_ip VARCHAR(50),
    reset_token_hash VARCHAR(255),
    reset_token_expires_at TIMESTAMP NULL,
    reset_token_used BOOLEAN DEFAULT FALSE,
    totp_secret VARCHAR(255),
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    backup_codes TEXT,
    last_login_at TIMESTAMP NULL,
    last_login_ip VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);