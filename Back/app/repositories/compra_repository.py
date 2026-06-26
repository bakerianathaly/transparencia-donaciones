from typing import Optional

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.compra import Compra, CompraCreate


class CompraRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: CompraCreate, imagen_url: Optional[str]) -> Compra:
        try:
            compra = Compra(
                nombre_local=data.nombre_local,
                moneda=data.moneda.upper(),
                cantidad=data.cantidad,
                imagen_url=imagen_url,
            )
            self.db.add(compra)
            await self.db.commit()
            await self.db.refresh(compra)
            return compra
        except Exception:
            await self.db.rollback()
            raise

    async def get_all(self, skip: int = 0, limit: int = 100) -> list[Compra]:
        result = await self.db.execute(
            select(Compra).order_by(Compra.created_at.desc()).offset(skip).limit(limit)
        )
        return list(result.scalars().all())

    async def count(self) -> int:
        result = await self.db.execute(select(func.count()).select_from(Compra))
        return result.scalar_one()
