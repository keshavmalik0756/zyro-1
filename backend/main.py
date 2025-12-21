from fastapi import FastAPI
from app.core.conf import APP_NAME, APP_VERSION, DEBUG, API_V1_PREFIX
from app.api.v1 import api_router
from app.db.connection import Base, engine, get_db

app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    debug=DEBUG
)

Base.metadata.create_all(bind=engine)
# Include API router
app.include_router(api_router, prefix=API_V1_PREFIX)

@app.get("/")
async def root():
    return {"message": "Welcome to Zyro API"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

