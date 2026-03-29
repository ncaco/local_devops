from fastapi import APIRouter

from app.api.v1.approvals import router as approvals_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.failures import router as failures_router

router = APIRouter(prefix="/api/v1", tags=["v1"])
router.include_router(dashboard_router)
router.include_router(approvals_router)
router.include_router(failures_router)
