CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  code VARCHAR(40) NOT NULL UNIQUE,
  parent_department_id INTEGER NULL REFERENCES departments(id)
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(80) NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  role VARCHAR(32) NOT NULL CHECK (role IN ('HR', 'MANAGER', 'EMPLOYEE', 'ADMIN')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id),
  employee_number VARCHAR(80) NOT NULL UNIQUE,
  first_name VARCHAR(80) NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  department_id INTEGER NOT NULL REFERENCES departments(id),
  manager_id INTEGER NULL REFERENCES employees(id),
  salary NUMERIC(12,2) NOT NULL,
  experience_years NUMERIC(5,2) NOT NULL DEFAULT 0,
  hire_date DATE NOT NULL,
  employment_status VARCHAR(40) NOT NULL DEFAULT 'Active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  category VARCHAR(80) NOT NULL,
  description TEXT
);

CREATE TABLE employee_skills (
  employee_id INTEGER NOT NULL REFERENCES employees(id),
  skill_id INTEGER NOT NULL REFERENCES skills(id),
  proficiency_level INTEGER NOT NULL CHECK (proficiency_level BETWEEN 1 AND 5),
  source VARCHAR(60) NOT NULL DEFAULT 'manual',
  PRIMARY KEY (employee_id, skill_id)
);

CREATE TABLE resumes (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER NOT NULL REFERENCES employees(id),
  file_name VARCHAR(255) NOT NULL,
  file_uri TEXT NOT NULL,
  parsed_at TIMESTAMPTZ,
  confidence_score NUMERIC(5,2),
  raw_resume_text TEXT
);

CREATE TABLE training_programs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  estimated_duration_weeks INTEGER NOT NULL,
  priority VARCHAR(40) NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'Draft'
);

CREATE TABLE employee_training_enrollments (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER NOT NULL REFERENCES employees(id),
  training_program_id INTEGER NOT NULL REFERENCES training_programs(id),
  completion_status VARCHAR(40) NOT NULL DEFAULT 'Not Started',
  completion_date TIMESTAMPTZ,
  UNIQUE (employee_id, training_program_id)
);

CREATE TABLE predictions (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER NOT NULL REFERENCES employees(id),
  model_version VARCHAR(80) NOT NULL,
  predicted_attrition_probability NUMERIC(5,4) NOT NULL,
  risk_level VARCHAR(40) NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High', 'Critical')),
  prediction_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  explanation JSONB NOT NULL,
  confidence_score NUMERIC(5,4) NOT NULL
);

CREATE TABLE recommendations (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER NOT NULL REFERENCES employees(id),
  recommendation_type VARCHAR(80) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(40) NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'Open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  report_type VARCHAR(80) NOT NULL,
  generated_by INTEGER NOT NULL REFERENCES users(id),
  format VARCHAR(40) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  file_uri TEXT
);

CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  notification_type VARCHAR(60) NOT NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(120) NOT NULL,
  resource_type VARCHAR(120) NOT NULL,
  resource_id INTEGER,
  ip_address VARCHAR(64),
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
