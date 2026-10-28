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

## Render Deployment

This project includes a `render.yaml` blueprint for one-click deployment to [Render](https://render.com):

1. Push this repository to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**.
3. Connect your GitHub repo and select the branch.
4. Render will auto-detect `render.yaml` and create:
   - **strata-ai-api** — Python FastAPI backend (free tier, SQLite)
   - **strata-ai-workforce** — Static frontend site (free tier, Vite build)
5. After deployment, update the `ALLOWED_ORIGINS` env var on the backend to include your actual frontend URL.
6. Set `VITE_API_BASE_URL` on the frontend to your actual backend URL.

### Live URLs (after deployment)

- Frontend: `https://strata-ai-workforce.onrender.com`
- Backend API: `https://strata-ai-api.onrender.com`
- API Docs: `https://strata-ai-api.onrender.com/docs`
