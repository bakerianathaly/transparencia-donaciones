from app.repositories.compra_repository import CompraRepository
from app.services.compra.crear_compra import CrearCompra
from app.services.compra.leer_compra import LeerCompra


class CompraService:
    def __init__(self, repository: CompraRepository):
        self.crear = CrearCompra(repository)
        self.leer = LeerCompra(repository)
