from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import CompraDeps
from app.exceptions import ValidationException
from app.models.api_response import APIResponse
from app.models.compra import CompraCreate, CompraListItem, CompraResponse
from app.services.compra import CompraService

router = APIRouter(prefix="/compras", tags=["compras"])


@router.post(
    "/",
    response_model=APIResponse[CompraResponse],
    status_code=status.HTTP_201_CREATED,
)
async def registrar_compra(
    compra: CompraCreate,
    service: CompraService = Depends(CompraDeps.get_service),
) -> APIResponse[CompraResponse]:
    try:
        nueva = await service.crear.execute(compra)
        return APIResponse(success=True, message="Compra registrada", outcome=[nueva])
    except ValidationException as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=APIResponse[CompraListItem])
async def listar_compras(
    skip: int = 0,
    limit: int = 100,
    service: CompraService = Depends(CompraDeps.get_service),
) -> APIResponse[CompraListItem]:
    try:
        compras, total = await service.leer.listar(skip, limit)
        return APIResponse(
            success=True,
            message=f"{total} compra(s) registrada(s)" if compras else "No hay compras registradas",
            outcome=compras,
        )
    except ValidationException as e:
        raise HTTPException(status_code=400, detail=str(e))
