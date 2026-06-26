import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy import Column, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlmodel import Field, SQLModel


# ─── Modelo DB ───────────────────────────────────────────────
class Donacion(SQLModel, table=True):
    __tablename__ = "donaciones"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=Column(UUID, primary_key=True),
    )
    nombre: str = Field(max_length=100)
    apellido: str = Field(max_length=100)
    moneda: str = Field(max_length=10)
    cantidad: Decimal = Field(max_digits=18, decimal_places=2)
    tasa_cambio: Optional[Decimal] = Field(default=None, max_digits=18, decimal_places=6)
    cantidad_bolivares: Optional[Decimal] = Field(default=None, max_digits=18, decimal_places=2)
    imagen_url: str = Field(sa_column=Column(Text))
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(
        default_factory=datetime.now,
        sa_column_kwargs={
            "onupdate": datetime.now,
        },
        nullable=False,
    )


# ─── Schemas API ─────────────────────────────────────────────
class DonacionCreate(SQLModel):
    nombre: str = Field(max_length=100)
    apellido: str = Field(max_length=100)
    moneda: str = Field(max_length=10)
    cantidad: Decimal = Field(decimal_places=2)
    tasa_cambio: Optional[Decimal] = Field(default=None, decimal_places=6)
    imagen_base64: str


class DonacionResponse(SQLModel):
    id: uuid.UUID
    nombre: str
    apellido: str
    moneda: str
    cantidad: Decimal
    tasa_cambio: Optional[Decimal]
    cantidad_bolivares: Optional[Decimal]
    imagen_url: str
    created_at: datetime
    updated_at: Optional[datetime]
