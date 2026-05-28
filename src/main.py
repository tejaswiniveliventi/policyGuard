"""
PolicyGuard FastAPI application entry point.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from src.config import AppConfig
from src.core.logger import get_logger, LoggerSetup
from src.core.database import DatabaseManager
from src.api.routes import register_routes

# Initialize logger
LoggerSetup.initialize()
logger = get_logger("policyguard.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle (startup and shutdown)."""
    # Startup
    logger.info(f"Starting {AppConfig.APP_NAME} ({AppConfig.ENVIRONMENT})")
    DatabaseManager.initialize(AppConfig.DATABASE_URL)
    DatabaseManager.create_tables()
    yield

    # Shutdown
    logger.info("Shutting down...")
    DatabaseManager.close()


# Create FastAPI app
app = FastAPI(
    title=AppConfig.APP_NAME, version=AppConfig.APP_VERSION, lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
register_routes(app)


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": AppConfig.APP_NAME,
        "version": AppConfig.APP_VERSION,
        "docs": "/docs",
        "health": "/api/health",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "src.main:app",
        host=AppConfig.API_HOST,
        port=AppConfig.API_PORT,
        reload=AppConfig.DEBUG,
        log_config=None,  # "utils/logging_config.yaml"
    )
