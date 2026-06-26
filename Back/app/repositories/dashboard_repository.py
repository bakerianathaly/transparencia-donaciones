from decimal import Decimal

from sqlalchemy import case, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.compra import Compra
from app.models.dashboard import ResumenDonaciones, ResumenGastos
from app.models.donacion import Donacion


class DashboardRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_resumen(self) -> ResumenDonaciones:
        result_donaciones = await self.db.execute(
            select(
                func.count().label("total_donaciones"),
                func.coalesce(
                    func.sum(case((Donacion.moneda == "DOLARES", Donacion.cantidad), else_=0)), 0
                ).label("total_usd"),
                func.coalesce(
                    func.sum(case((Donacion.moneda == "BOLIVARES", Donacion.cantidad), else_=0)), 0
                ).label("total_bolivares"),
                func.coalesce(
                    func.sum(case((Donacion.moneda == "USDT", Donacion.cantidad), else_=0)), 0
                ).label("total_usdt"),
                func.coalesce(
                    func.sum(case((Donacion.moneda == "EUROS", Donacion.cantidad), else_=0)), 0
                ).label("total_eur"),
                func.coalesce(
                    func.sum(case((Donacion.moneda == "LIBRAS ESTERLINAS", Donacion.cantidad), else_=0)), 0
                ).label("total_libras"),
            ).select_from(Donacion)
        )
        don = result_donaciones.one()

        result_compras = await self.db.execute(
            select(
                func.coalesce(
                    func.sum(case((Compra.moneda == "DOLARES", Compra.cantidad), else_=0)), 0
                ).label("total_usd"),
                func.coalesce(
                    func.sum(case((Compra.moneda == "BOLIVARES", Compra.cantidad), else_=0)), 0
                ).label("total_bolivares"),
                func.coalesce(
                    func.sum(case((Compra.moneda == "USDT", Compra.cantidad), else_=0)), 0
                ).label("total_usdt"),
                func.coalesce(
                    func.sum(case((Compra.moneda == "EUROS", Compra.cantidad), else_=0)), 0
                ).label("total_eur"),
                func.coalesce(
                    func.sum(case((Compra.moneda == "LIBRAS ESTERLINAS", Compra.cantidad), else_=0)), 0
                ).label("total_libras"),
            ).select_from(Compra)
        )
        gasto = result_compras.one()

        return ResumenDonaciones(
            total_donaciones=don.total_donaciones,
            total_usd=Decimal(str(don.total_usd)),
            total_bolivares=Decimal(str(don.total_bolivares)),
            total_usdt=Decimal(str(don.total_usdt)),
            total_eur=Decimal(str(don.total_eur)),
            total_libras=Decimal(str(don.total_libras)),
            gastos=ResumenGastos(
                total_usd=Decimal(str(gasto.total_usd)),
                total_bolivares=Decimal(str(gasto.total_bolivares)),
                total_usdt=Decimal(str(gasto.total_usdt)),
                total_eur=Decimal(str(gasto.total_eur)),
                total_libras=Decimal(str(gasto.total_libras)),
            ),
        )
