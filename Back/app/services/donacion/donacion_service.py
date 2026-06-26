from app.repositories.donacion_repository import DonacionRepository
from app.services.donacion.crear_donacion import CrearDonacion
from app.services.donacion.leer_donacion import LeerDonacion


class DonacionService:
    def __init__(self, repository: DonacionRepository):
        self.crear = CrearDonacion(repository)
        self.leer = LeerDonacion(repository)
