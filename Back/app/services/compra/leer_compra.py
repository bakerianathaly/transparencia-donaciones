from app.exceptions import ValidationException
from app.models.compra import Compra
from app.repositories.compra_repository import CompraRepository


class LeerCompra:
    def __init__(self, repository: CompraRepository):
        self.repository = repository

    async def listar(self, skip: int = 0, limit: int = 100) -> tuple[list[Compra], int]:
        self._validar_paginacion(skip, limit)
        compras = await self.repository.get_all(skip, limit)
        total = await self.repository.count()
        return compras, total

    def _validar_paginacion(self, skip: int, limit: int) -> None:
        if skip < 0:
            raise ValidationException("El parámetro skip no puede ser negativo")
        if limit < 1:
            raise ValidationException("El límite debe ser al menos 1")
        if limit > 1000:
            raise ValidationException("El límite no puede exceder 1000")
