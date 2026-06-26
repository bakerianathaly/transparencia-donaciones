from starlette.config import Config

config = Config(".env")

PROJECT_NAME = "Cronicos"
DESCRIPTION = "Sistema de Pacientes Cronicos de Venemergencia"
DEBUG: bool = False
TIMEZONE: str = "America/Caracas"

VERSION = "1.0.0"
API_PREFIX = "/api/v1"

DATABASE_URL = config("DATABASE_URL", cast=str)

R2_ACCOUNT_ID = config("R2_ACCOUNT_ID", cast=str)
R2_ACCESS_KEY_ID = config("R2_ACCESS_KEY_ID", cast=str)
R2_SECRET_ACCESS_KEY = config("R2_SECRET_ACCESS_KEY", cast=str)
R2_BUCKET_NAME = config("R2_BUCKET_NAME", cast=str)
R2_PUBLIC_URL = config("R2_PUBLIC_URL", cast=str)
