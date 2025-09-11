
CREATE TABLE IF NOT EXISTS reset_password_codes (
    user_id VARCHAR(255) PRIMARY KEY,
    code VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE
);