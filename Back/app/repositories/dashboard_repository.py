from decimal import Decimal

from sqlalchemy import case, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.dashboard import ResumenDonaciones
from app.models.donacion import Donacion


class DashboardRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_resumen(self) -> ResumenDonaciones:
        result = await self.db.execute(
            select(
                func.count().label("total_donaciones"),
                func.coalesce(
                    func.sum(case((Donacion.moneda == "USD", Donacion.cantidad), else_=0)), 0
                ).label("total_usd"),
                func.coalesce(
                    func.sum(case((Donacion.moneda == "BOLIVARES", Donacion.cantidad), else_=0)), 0
                ).label("total_bolivares"),
                func.coalesce(
                    func.sum(case((Donacion.moneda == "USDT", Donacion.cantidad), else_=0)), 0
                ).label("total_usdt"),
                func.coalesce(
                    func.sum(case((Donacion.moneda == "EUR", Donacion.cantidad), else_=0)), 0
                ).label("total_eur"),
            ).select_from(Donacion)
        )
        row = result.one()
        return ResumenDonaciones(
            total_donaciones=row.total_donaciones,
            total_usd=Decimal(str(row.total_usd)),
            total_bolivares=Decimal(str(row.total_bolivares)),
            total_usdt=Decimal(str(row.total_usdt)),
            total_eur=Decimal(str(row.total_eur)),
        )
