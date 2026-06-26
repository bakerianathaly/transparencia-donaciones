from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.sessions import get_db
from app.repositories.compra_repository import CompraRepository
from app.repositories.dashboard_repository import DashboardRepository
from app.repositories.donacion_repository import DonacionRepository
from app.services.compra import CompraService
from app.services.dashboard import DashboardService
from app.services.donacion import DonacionService


class CompraDeps:
    @staticmethod
    def get_repository(db: AsyncSession = Depends(get_db)) -> CompraRepository:
        return CompraRepository(db)

    @staticmethod
    def get_service(
        repo: CompraRepository = Depends(get_repository),
    ) -> CompraService:
        return CompraService(repo)


class DashboardDeps:
    @staticmethod
    def get_repository(db: AsyncSession = Depends(get_db)) -> DashboardRepository:
        return DashboardRepository(db)

    @staticmethod
    def get_service(
        repo: DashboardRepository = Depends(get_repository),
    ) -> DashboardService:
        return DashboardService(repo)


class DonacionDeps:
    @staticmethod
    def get_repository(db: AsyncSession = Depends(get_db)) -> DonacionRepository:
        return DonacionRepository(db)

    @staticmethod
    def get_service(
        repo: DonacionRepository = Depends(get_repository),
    ) -> DonacionService:
        return DonacionService(repo)
