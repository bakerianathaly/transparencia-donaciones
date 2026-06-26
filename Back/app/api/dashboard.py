from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import DashboardDeps
from app.models.api_response import APIResponse
from app.models.dashboard import ResumenDonaciones
from app.services.dashboard import DashboardService

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/resumen", response_model=APIResponse[ResumenDonaciones])
async def obtener_resumen(
    service: DashboardService = Depends(DashboardDeps.get_service),
) -> APIResponse[ResumenDonaciones]:
    try:
        resumen = await service.get_resumen()
        return APIResponse(success=True, message="Resumen de donaciones", outcome=[resumen])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
