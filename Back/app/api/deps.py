from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.sessions import get_db
from app.repositories.donacion_repository import DonacionRepository
from app.repositories.producto_repository import ProductoRepository
from app.services.donacion import DonacionService
from app.services.producto import ProductoService


class ProductoDeps:
    @staticmethod
    def get_repository(db: AsyncSession = Depends(get_db)) -> ProductoRepository:
        return ProductoRepository(db)

    @staticmethod
    def get_service(
        repo: ProductoRepository = Depends(get_repository),
    ) -> ProductoService:
        return ProductoService(repo)


class DonacionDeps:
    @staticmethod
    def get_repository(db: AsyncSession = Depends(get_db)) -> DonacionRepository:
        return DonacionRepository(db)

    @staticmethod
    def get_service(
        repo: DonacionRepository = Depends(get_repository),
    ) -> DonacionService:
        return DonacionService(repo)
