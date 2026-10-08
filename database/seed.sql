INSERT INTO departments (name, code, parent_department_id) VALUES
('Engineering', 'ENG', NULL),
('People & Culture', 'HR', NULL),
('Sales', 'SAL', NULL),
('Finance', 'FIN', NULL),
('Support', 'SUP', NULL);

INSERT INTO users (email, password_hash, first_name, last_name, role, is_active) VALUES
('admin@enterprise.workforce', '$2b$12$dummyhash', 'System', 'Admin', 'ADMIN', TRUE),
('hr@enterprise.workforce', '$2b$12$dummyhash', 'Avery', 'Morgan', 'HR', TRUE),
('manager@enterprise.workforce', '$2b$12$dummyhash', 'Jordan', 'Carter', 'MANAGER', TRUE),
('employee@enterprise.workforce', '$2b$12$dummyhash', 'Morgan', 'Lee', 'EMPLOYEE', TRUE);

INSERT INTO skills (name, category, description) VALUES
('Python', 'Technical', 'Programming language'),
('Machine Learning', 'Technical', 'AI model development'),
('Cloud Platforms', 'Cloud', 'Cloud architecture literacy'),
('Executive Communication', 'Soft Skill', 'Stakeholder communication'),
('Talent Management', 'Leadership', 'People development capability');
