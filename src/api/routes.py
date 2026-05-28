"""Register all API routes."""

from fastapi import FastAPI
from src.api import health, org
from src.exceptions import PolicyGuardException
from fastapi.responses import JSONResponse
from fastapi import FastAPI
from src.api import health, org, policies, alerts, notifications


def register_routes(app: FastAPI):
    """Register all API routes."""

    # Include routers
    app.include_router(health.router)
    app.include_router(org.router)

    app.include_router(policies.router)
    app.include_router(alerts.router)
    app.include_router(notifications.router)  # ADD THIS

    # Exception handlers
    @app.exception_handler(PolicyGuardException)
    async def policyguard_exception_handler(request, exc):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error_code": exc.error_code,
                "message": exc.message,
                "details": exc.details,
            },
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(request, exc):
        return JSONResponse(
            status_code=500,
            content={
                "error_code": "INTERNAL_ERROR",
                "message": str(exc),
                "details": {},
            },
        )
