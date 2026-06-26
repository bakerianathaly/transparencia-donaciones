from typing import Optional
from uuid import UUID

from app.exceptions import ValidationException
from app.models.donacion import Donacion
from app.repositories.donacion_repository import DonacionRepository


class LeerDonacion:
    def __init__(self, repository: DonacionRepository):
        self.repository = repository

    async def listar(self, skip: int = 0, limit: int = 100) -> list[Donacion]:
        self._validar_paginacion(skip, limit)
        return await self.repository.get_all(skip, limit)

    async def obtener(self, donacion_id: UUID) -> Optional[Donacion]:
        return await self.repository.get_by_id(donacion_id)

    def _validar_paginacion(self, skip: int, limit: int) -> None:
        if skip < 0:
            raise ValidationException("El parámetro skip no puede ser negativo")
        if limit < 1:
            raise ValidationException("El límite debe ser al menos 1")
        if limit > 1000:
            raise ValidationException("El límite no puede exceder 1000")
