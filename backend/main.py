"""Project Eureka - Main FastAPI Application."""

import time
import uuid
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from loguru import logger

from api.routes import (
    admin_router,
    auth_router,
    professor_router,
    student_router,
    translation_router,
    accreditation_router,
    syllabus_router,
    staff_performance_router,
    placement_router,
    tool_utilization_router,
    parent_portal_router,
    industry_connect_router,
    research_grants_router,
    alumni_router,
)
from api.routes.exam_prep import router as exam_prep_router
from config import settings

Path("logs").mkdir(exist_ok=True)

logger.remove()
logger.add("logs/app.log", rotation="10 MB", level=settings.log_level)
logger.add(lambda msg: print(msg, end=""), level=settings.log_level)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {settings.app_name} in {settings.app_env} mode")
    yield
    logger.info("Shutting down application")


app = FastAPI(lifespan=lifespan,
    title=settings.app_name,
    description="AI Academic Intelligence Platform - Project Eureka Backend API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1|\d{1,3}(?:\.\d{1,3}){3})(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1")
app.include_router(student_router, prefix="/api/v1")
app.include_router(professor_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1")
app.include_router(translation_router, prefix="/api/v1")
app.include_router(exam_prep_router, prefix="/api/v1")
app.include_router(accreditation_router, prefix="/api/v1")
app.include_router(syllabus_router, prefix="/api/v1")
app.include_router(staff_performance_router, prefix="/api/v1")
app.include_router(placement_router, prefix="/api/v1/placement")
app.include_router(tool_utilization_router, prefix="/api/v1/tool-utilization")
app.include_router(parent_portal_router, prefix="/api/v1/parent-portal")
app.include_router(industry_connect_router, prefix="/api/v1/industry-connect")
app.include_router(research_grants_router, prefix="/api/v1/research-grants")
app.include_router(alumni_router, prefix="/api/v1/alumni")


@app.middleware("http")
async def add_request_context(request: Request, call_next):
    request_id = request.headers.get("x-request-id") or str(uuid.uuid4())
    start = time.perf_counter()
    response = await call_next(request)
    duration_ms = (time.perf_counter() - start) * 1000

    response.headers["x-request-id"] = request_id
    response.headers["x-response-time-ms"] = f"{duration_ms:.2f}"
    logger.info(
        f"{request.method} {request.url.path} -> {response.status_code} "
        f"[{duration_ms:.2f}ms] request_id={request_id}"
    )
    return response


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    request_id = request.headers.get("x-request-id") or str(uuid.uuid4())
    logger.exception(
        f"Unhandled error on {request.method} {request.url.path} "
        f"request_id={request_id}: {exc}"
    )
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "request_id": request_id,
        },
        headers={"x-request-id": request_id},
    )


@app.get("/")
async def root():
    return {
        "app": settings.app_name,
        "version": "1.0.0",
        "status": "running",
        "environment": settings.app_env,
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": settings.app_name,
        "environment": settings.app_env,
        "version": "1.0.0",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
        log_level=settings.log_level.lower(),
    )


