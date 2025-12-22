from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from app.core.conf import APP_NAME, APP_VERSION, DEBUG, API_V1_PREFIX
from app.api.v1 import api_router
from app.common.exception_handler import (
    global_exception_handler,
    http_exception_handler,
    validation_exception_handler
)

app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    debug=DEBUG
)

# Register exception handlers
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)

# Note: Database tables should be created using Alembic migrations
# Run: alembic upgrade head
# Base.metadata.create_all() doesn't work with AsyncEngine

# Include API router
app.include_router(api_router, prefix=API_V1_PREFIX)

@app.get("/")
async def root():
    return {"message": "Welcome to Zyro API"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

