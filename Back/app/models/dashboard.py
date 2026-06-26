from decimal import Decimal

from sqlmodel import SQLModel


class ResumenGastos(SQLModel):
    total_usd: Decimal
    total_bolivares: Decimal
    total_usdt: Decimal
    total_eur: Decimal
    total_libras: Decimal


class ResumenDonaciones(SQLModel):
    total_donaciones: int
    total_usd: Decimal
    total_bolivares: Decimal
    total_usdt: Decimal
    total_eur: Decimal
    total_libras: Decimal
    gastos: ResumenGastos
