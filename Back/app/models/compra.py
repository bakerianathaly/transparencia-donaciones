import uuid
from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from pydantic import field_validator
from sqlalchemy import Column, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlmodel import Field, SQLModel


class Compra(SQLModel, table=True):
    __tablename__ = "compras"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=Column(UUID, primary_key=True),
    )
    nombre_local: str = Field(max_length=200)
    moneda: str = Field(max_length=10)
    cantidad: Decimal = Field(max_digits=18, decimal_places=2)
    imagen_url: Optional[str] = Field(default=None, sa_column=Column(Text, nullable=True))
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(
        default_factory=datetime.now,
        sa_column_kwargs={"onupdate": datetime.now},
        nullable=False,
    )


class CompraCreate(SQLModel):
    nombre_local: str = Field(max_length=200)
    moneda: str = Field(max_length=10)
    cantidad: Decimal = Field(decimal_places=2)
    imagen_base64: str


class CompraResponse(SQLModel):
    id: uuid.UUID
    nombre_local: str
    moneda: str
    cantidad: Decimal
    imagen_url: Optional[str]
    created_at: datetime


class CompraListItem(SQLModel):
    id: uuid.UUID
    nombre_local: str
    moneda: str
    cantidad: Decimal
    imagen_url: Optional[str]
    created_at: date

    @field_validator("created_at", mode="before")
    @classmethod
    def extraer_fecha(cls, v):
        if isinstance(v, datetime):
            return v.date()
        return v
