from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import DonacionDeps
from app.exceptions import ValidationException
from app.models.api_response import APIResponse
from app.models.donacion import DonacionCreate, DonacionResponse
from app.services.donacion import DonacionService

router = APIRouter(prefix="/donaciones", tags=["donaciones"])


@router.post(
    "/",
    response_model=APIResponse[DonacionResponse],
    status_code=status.HTTP_201_CREATED,
)
async def registrar_donacion(
    donacion: DonacionCreate,
    service: DonacionService = Depends(DonacionDeps.get_service),
) -> APIResponse[DonacionResponse]:
    try:
        nueva = await service.crear.execute(donacion)
        return APIResponse(success=True, message="Donación registrada", outcome=[nueva])
    except ValidationException as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=APIResponse[DonacionResponse])
async def listar_donaciones(
    skip: int = 0,
    limit: int = 100,
    service: DonacionService = Depends(DonacionDeps.get_service),
) -> APIResponse[DonacionResponse]:
    try:
        donaciones = await service.leer.listar(skip, limit)
        return APIResponse(
            success=True,
            message="Lista de donaciones" if donaciones else "No hay donaciones registradas",
            outcome=donaciones,
        )
    except ValidationException as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{donacion_id}", response_model=APIResponse[DonacionResponse])
async def obtener_donacion(
    donacion_id: UUID,
    service: DonacionService = Depends(DonacionDeps.get_service),
) -> APIResponse[DonacionResponse]:
    donacion = await service.leer.obtener(donacion_id)
    if not donacion:
        raise HTTPException(status_code=404, detail="Donación no encontrada")
    return APIResponse(success=True, message="Donación encontrada", outcome=[donacion])
