from fastapi import FastAPI
from fastapi.responses import JSONResponse

from app.api.routes.health import router as health_router
from app.api.routes.v1 import router as v1_router

app = FastAPI(
    title="SNS Automation Backend",
    version="0.1.0",
    default_response_class=JSONResponse,
)

app.include_router(health_router)
app.include_router(v1_router)

