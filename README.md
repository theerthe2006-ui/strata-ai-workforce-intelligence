# Enterprise Workforce Predictive Analytics Engine

A corporate HR intelligence platform for workforce analytics, resume intelligence, skill gap detection, attrition prediction, executive reporting, and employee retention recommendations.

## Architecture

- Frontend: React, TypeScript, Vite, Tailwind-inspired design, Shadcn-style UI patterns.
- Backend: Python FastAPI with JWT-ready authentication, role-based access, analytics APIs, and prediction endpoints.
- ML: Python scikit-learn/XGBoost pipeline for attrition prediction and workforce insight modules.
- Database: PostgreSQL schema for employees, departments, skills, resumes, training, recommendations, reports, notifications, and audit logs.
- Deployment: Docker Compose, Dockerfiles, CI/CD GitHub Actions starter, env configuration.

## Quick Start

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Docker

```bash
docker compose up --build
```

## API

OpenAPI docs: http://localhost:8000/docs

## Security

The solution includes JWT-ready middleware, RBAC, rate limiting, input validation, CORS, and audit logging constructs.
