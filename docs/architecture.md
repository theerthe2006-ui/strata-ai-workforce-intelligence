# Enterprise Workforce Predictive Analytics Engine

## Platform Architecture

The Enterprise Workforce Predictive Analytics Engine is a domain-oriented, secure business intelligence platform. It combines human resource analytics, workforce planning, AI-based skills intelligence, resume parsing, prediction services, and business reporting.

## Layered Architecture

### Presentation
- Responsive React 19 + TypeScript+Vite frontend.
- Shadcn-inspired design system with Tailwind utilities and Recharts visualizations.

### API Layer
- FastAPI REST API with versioned routes.
- OpenAPI documentation and health endpoints.

### Application Layer
- Use-case services: WorkforceAnalyticsService, PredictionEngineService.
- DTO schema validation and input boundary definitions.

### Domain Layer
- Employee domain model and contract-oriented schemas.
- Retention recommendation domain patterns.

### Infrastructure Layer
- PostgreSQL persistence layer, Redis cache-ready integration, S3 upload-ready interfaces.

## Security

- JWT access token and refresh token support
- RBAC classification for HR, Manager, Employee, Admin
- CORS, trusted host, input validation, and audit logging hooks

## Deployment

The system is designed for containerized deployment using Docker Compose.
