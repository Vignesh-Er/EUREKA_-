# Project Eureka - Backend API

AI Academic Intelligence Platform powered by NVIDIA AI technologies.

## Overview

Project Eureka is a comprehensive AI-powered academic intelligence platform that provides:

- **Discovery Engine**: Student profiling and lab recommendations using NVIDIA NeMo
- **Curriculum Context Engine**: Context card generation using NVIDIA NIM
- **Learning Journey Engine**: Personalized academic roadmaps
- **Evaluation Engine**: AI-generated micro-assessments
- **Lecture Companion Engine**: Multimodal lecture processing with NVIDIA Riva
- **Admin Assistant Engine**: Operational workflow automation
- **Translation Engine**: Multilingual content delivery

## Tech Stack

- **Framework**: FastAPI with async support
- **Database**: PostgreSQL (primary) + Qdrant (vector search)
- **Authentication**: JWT-based with OAuth2
- **AI/ML**: NVIDIA NeMo, NIM microservices, Riva
- **Containerization**: Docker & Docker Compose
- **Caching**: Redis

## Prerequisites

- Python 3.11+
- Docker & Docker Compose
- NVIDIA API keys (optional for production features)

## Quick Start

### 1. Clone and Setup

```bash
cd E:/Eureka/backend
cp .env.example .env
```

Edit `.env` and add your configuration:

```env
DATABASE_URL=postgresql+asyncpg://eureka:eureka_password@localhost:5432/eureka
NVIDIA_NEMO_API_KEY=your_key_here
NVIDIA_NIM_API_KEY=your_key_here
NVIDIA_RIVA_API_KEY=your_key_here
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
```

Supabase auth is optional and environment-driven. If `SUPABASE_URL` + `SUPABASE_ANON_KEY` are set, `/api/v1/auth/login` validates credentials against Supabase Auth first, then falls back to local mock users for development.

If you use role-based login (`student` / `professor` / `admin`), set `app_metadata.role` on Supabase users to match the requested role.

### 2. Using Docker Compose (Recommended)

```bash
# Start all services (PostgreSQL, Qdrant, Redis, Backend)
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

### 3. Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Start PostgreSQL, Qdrant, Redis (using Docker)
docker-compose up -d db qdrant redis

# Run the backend
python main.py

# Or with uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Documentation

Once running, access:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## API Endpoints

### Authentication

- `POST /api/v1/auth/login` - Authenticate user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/switch-role` - Switch user role
- `GET /api/v1/auth/me` - Get current user

### Student Routes

- `GET /api/v1/student/profile` - Get student profile
- `GET /api/v1/student/dashboard` - Get dashboard data
- `GET /api/v1/student/today` - Get today's schedule
- `GET /api/v1/student/context-card/{id}` - Get context card
- `GET /api/v1/student/courses` - Get enrolled courses
- `GET /api/v1/student/roadmap` - Get learning roadmap
- `GET /api/v1/student/assessments` - Get assessments
- `POST /api/v1/student/assessments/{id}/submit` - Submit assessment
- `GET /api/v1/student/badges` - Get earned badges
- `GET /api/v1/student/discovery/labs` - Get available labs

### Professor Routes

- `GET /api/v1/professor/profile` - Get professor profile
- `GET /api/v1/professor/analytics` - Get course analytics
- `GET /api/v1/professor/courses` - Get courses
- `GET /api/v1/professor/uploads` - Get recent uploads
- `GET /api/v1/professor/feedback` - Get student feedback
- `GET /api/v1/professor/insights` - Get AI insights
- `POST /api/v1/professor/upload` - Upload content
- `POST /api/v1/professor/generate-context-card` - Generate context card

### Admin Routes

- `GET /api/v1/admin/stats` - Get platform stats
- `GET /api/v1/admin/users` - Get user management
- `GET /api/v1/admin/requests` - Get pending requests
- `GET /api/v1/admin/labs` - Get lab utilization
- `POST /api/v1/admin/requests/hardware/{id}/evaluate` - Evaluate hardware request
- `GET /api/v1/admin/analytics/overview` - Get analytics overview

### Translation Routes

- `POST /api/v1/translation/translate` - Translate content
- `POST /api/v1/translation/transcribe` - Transcribe audio
- `POST /api/v1/translation/synthesize` - Synthesize speech
- `GET /api/v1/translation/languages` - Get supported languages

## NVIDIA API Integration

### Getting API Keys

1. **NVIDIA NIM**: Visit [NVIDIA NIM](https://build.nvidia.com/) for API access
2. **NVIDIA NeMo**: Access through [NVIDIA API Catalog](https://build.nvidia.com/explore/discover)
3. **NVIDIA Riva**: Available through [NVIDIA NGC](https://ngc.nvidia.com/)

### Using Mock Responses

If NVIDIA API keys are not configured, the backend automatically returns mock responses for development:

```python
# The engines detect missing API keys and return mock data
result = await discovery_engine.analyze_student_interests(student_id, interactions)
```

## Database Schema

The application uses the following main tables:

- `users` - User accounts (students, professors, admins)
- `student_profiles` - Student-specific data
- `professor_profiles` - Professor-specific data
- `labs` - Laboratory information
- `courses` - Course catalog
- `topics` - Course topics
- `context_cards` - AI-generated context cards
- `assessments` - Assessment definitions
- `lectures` - Lecture records
- `badges` - Gamification badges
- `learning_roadmaps` - Student learning paths

## Project Structure

```
backend/
├── api/
│   └── routes/
│       ├── auth.py          # Authentication endpoints
│       ├── student.py       # Student endpoints
│       ├── professor.py     # Professor endpoints
│       ├── admin.py         # Admin endpoints
│       └── translation.py   # Translation endpoints
├── config/
│   └── settings.py          # Configuration management
├── database/
│   ├── base.py              # SQLAlchemy base
│   └── session.py           # Database session
├── models/
│   ├── user.py              # User models
│   └── academic.py          # Academic entity models
├── services/
│   ├── auth.py              # Authentication service
│   └── nvidia_engines.py    # NVIDIA AI engine implementations
├── main.py                  # FastAPI application
├── docker-compose.yml       # Docker services
├── Dockerfile               # Container definition
└── requirements.txt         # Python dependencies
```

## Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=backend
```

## Development Notes

1. **Async/Await**: All database and AI engine operations use async/await
2. **JWT Tokens**: Access tokens expire after 24 hours by default
3. **CORS**: Configured to allow frontend origins from `.env`
4. **Logging**: Uses Loguru for structured logging

## License

Proprietary - Project Eureka
