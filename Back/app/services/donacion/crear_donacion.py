import asyncio
from decimal import Decimal

from app.exceptions import ValidationException
from app.models.donacion import Donacion, DonacionCreate
from app.repositories.donacion_repository import DonacionRepository
from app.services.r2 import R2Service


class CrearDonacion:
    MIN_CANTIDAD = Decimal("0.01")
    MIN_TASA = Decimal("0.000001")

    def __init__(self, repository: DonacionRepository):
        self.repository = repository
        self.r2 = R2Service()

    async def execute(self, data: DonacionCreate) -> Donacion:
        self._validar(data)

        loop = asyncio.get_event_loop()
        imagen_url = await loop.run_in_executor(None, self.r2.subir_imagen, data.imagen_base64)
        data.moneda = data.moneda.upper()
        cantidad_bolivares = (
            data.cantidad
            if data.moneda == "BOLIVARES"
            else data.cantidad * data.tasa_cambio
        )
        
        return await self.repository.create(data, imagen_url, cantidad_bolivares)

    def _validar(self, data: DonacionCreate) -> None:
        if not data.nombre or len(data.nombre.strip()) < 2:
            raise ValidationException("El nombre debe tener al menos 2 caracteres")

        if not data.apellido or len(data.apellido.strip()) < 2:
            raise ValidationException("El apellido debe tener al menos 2 caracteres")

        if not data.moneda or len(data.moneda.strip()) == 0:
            raise ValidationException("La moneda es requerida")

        if data.cantidad < self.MIN_CANTIDAD:
            raise ValidationException("La cantidad debe ser mayor a 0")

        if data.moneda != "BOLIVARES":
            if data.tasa_cambio is None:
                raise ValidationException(
                    "La tasa de cambio es requerida cuando la moneda no es BOLIVARES"
                )
            if data.tasa_cambio < self.MIN_TASA:
                raise ValidationException("La tasa de cambio debe ser mayor a 0")

        if not data.imagen_base64 or len(data.imagen_base64.strip()) == 0:
            raise ValidationException("La imagen es requerida")
