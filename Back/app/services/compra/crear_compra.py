import asyncio
from decimal import Decimal

from app.exceptions import ValidationException
from app.models.compra import Compra, CompraCreate
from app.repositories.compra_repository import CompraRepository
from app.services.r2 import R2Service

MONEDAS_VALIDAS = {"EURO", "DOLARES", "USDT", "BOLIVARES"}


class CrearCompra:
    MIN_CANTIDAD = Decimal("0.01")

    def __init__(self, repository: CompraRepository):
        self.repository = repository
        self.r2 = R2Service()

    async def execute(self, data: CompraCreate) -> Compra:
        self._validar(data)

        loop = asyncio.get_event_loop()
        imagen_url = await loop.run_in_executor(None, self.r2.subir_imagen, data.imagen_base64)

        return await self.repository.create(data, imagen_url)

    def _validar(self, data: CompraCreate) -> None:
        if not data.nombre_local or len(data.nombre_local.strip()) < 2:
            raise ValidationException("El nombre del local debe tener al menos 2 caracteres")

        if not data.moneda or data.moneda.upper() not in MONEDAS_VALIDAS:
            raise ValidationException(
                f"Moneda inválida. Las monedas permitidas son: {', '.join(MONEDAS_VALIDAS)}"
            )

        if data.cantidad < self.MIN_CANTIDAD:
            raise ValidationException("La cantidad debe ser mayor a 0")

        if not data.imagen_base64 or len(data.imagen_base64.strip()) == 0:
            raise ValidationException("La imagen es requerida")
