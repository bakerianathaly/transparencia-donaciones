from typing import Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.donacion import Donacion, DonacionCreate


class DonacionRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: DonacionCreate, cantidad_bolivares) -> Donacion:
        try:
            donacion = Donacion(
                nombre=data.nombre,
                apellido=data.apellido,
                moneda=data.moneda,
                cantidad=data.cantidad,
                tasa_cambio=data.tasa_cambio,
                cantidad_bolivares=cantidad_bolivares,
                imagen_url=data.imagen_base64,
            )
            self.db.add(donacion)
            await self.db.commit()
            await self.db.refresh(donacion)
            return donacion
        except Exception:
            await self.db.rollback()
            raise

    async def get_by_id(self, donacion_id: UUID) -> Optional[Donacion]:
        return await self.db.get(Donacion, donacion_id)

    async def get_all(self, skip: int = 0, limit: int = 100) -> list[Donacion]:
        result = await self.db.execute(
            select(Donacion).offset(skip).limit(limit)
        )
        return list(result.scalars().all())
