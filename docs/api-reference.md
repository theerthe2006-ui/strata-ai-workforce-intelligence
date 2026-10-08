# API Reference

## Core API

Base URL: http://localhost:8000/api/v1

### Health

- GET /health
- GET /health/ready

### Auth

- POST /auth/login
- POST /auth/register
- POST /auth/forgot-password
- POST /auth/verify-otp

### Workforce

- GET /workforce/summary
- GET /workforce/employees
- GET /workforce/skills/gaps
- GET /workforce/attrition/prediction
