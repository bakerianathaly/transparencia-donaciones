from app.models.dashboard import ResumenDonaciones
from app.repositories.dashboard_repository import DashboardRepository


class DashboardService:
    def __init__(self, repository: DashboardRepository):
        self.repository = repository

    async def get_resumen(self) -> ResumenDonaciones:
        return await self.repository.get_resumen()
