from decimal import Decimal

from sqlmodel import SQLModel


class ResumenDonaciones(SQLModel):
    total_donaciones: int
    total_usd: Decimal
    total_bolivares: Decimal
    total_usdt: Decimal
    total_eur: Decimal
