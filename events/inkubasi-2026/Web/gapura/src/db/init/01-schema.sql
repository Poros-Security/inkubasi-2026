CREATE DATABASE IF NOT EXISTS goypurea_yube;
CREATE DATABASE IF NOT EXISTS auditlog;

CREATE USER IF NOT EXISTS 'postmaster'@'%' IDENTIFIED BY '';
GRANT FILE ON *.* TO 'postmaster'@'%';
GRANT SELECT ON goypurea_yube.* TO 'postmaster'@'%';
GRANT SELECT ON auditlog.* TO 'postmaster'@'%';

USE goypurea_yube;

CREATE TABLE IF NOT EXISTS announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(120) NOT NULL,
    body TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS hints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hint VARCHAR(255) NOT NULL
);

INSERT INTO announcements (title, body) VALUES
    (
        'Maintenance Window',
        'Keep legacy diagnostics online until the migration is complete.'
    ),
    (
        'File Audit',
        'Legacy diagnostics still reference direct file reads during database-side compatibility testing.'
    );

INSERT INTO hints (hint) VALUES
    ('the flag is in /flag.txt');

USE auditlog;

CREATE TABLE IF NOT EXISTS login_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(64) NOT NULL,
    source_ip VARCHAR(45) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO login_events (username, source_ip) VALUES
    ('admin.portal', '172.18.3.41'),
    ('service.monitor', '127.0.0.1');

FLUSH PRIVILEGES;