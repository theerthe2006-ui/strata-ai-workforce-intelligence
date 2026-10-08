# Deployment Guide

## Prerequisites

- Docker Engine 24+
- Docker Compose v2
- Python 3.12+
- Node.js 22+

## Local Development

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Docker

```bash
docker compose up --build
```

## Environment Variables

The backend reads settings from environment variables and optional .env files. A production deployment should define:

- DATABASE_URL
- REDIS_URL
- SECRET_KEY
- ALLOWED_ORIGINS
- APP_ENV
