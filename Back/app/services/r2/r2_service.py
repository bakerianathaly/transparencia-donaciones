import base64
import uuid

import boto3
from botocore.exceptions import BotoCoreError, ClientError

from app.exceptions import ValidationException
from shared.config import (
    R2_ACCESS_KEY_ID,
    R2_ACCOUNT_ID,
    R2_BUCKET_NAME,
    R2_PUBLIC_URL,
    R2_SECRET_ACCESS_KEY,
)

EXTENSIONES_PERMITIDAS = {"jpeg": "jpg", "jpg": "jpg", "png": "png", "webp": "webp"}


class R2Service:
    def __init__(self):
        self.client = boto3.client(
            "s3",
            endpoint_url=f"https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com",
            aws_access_key_id=R2_ACCESS_KEY_ID,
            aws_secret_access_key=R2_SECRET_ACCESS_KEY,
            region_name="auto",
        )

    def subir_imagen(self, imagen_base64: str) -> str:
        content_type, imagen_bytes = self._decodificar(imagen_base64)
        extension = self._extension(content_type)
        key = f"{uuid.uuid4()}.{extension}"

        try:
            self.client.put_object(
                Bucket=R2_BUCKET_NAME,
                Key=key,
                Body=imagen_bytes,
                ContentType=content_type,
            )
        except (BotoCoreError, ClientError) as e:
            raise ValidationException(f"Error al subir la imagen: {str(e)}")

        return f"{R2_PUBLIC_URL.rstrip('/')}/{key}"

    def _decodificar(self, imagen_base64: str) -> tuple[str, bytes]:
        content_type = "image/jpeg"
        data = imagen_base64

        if imagen_base64.startswith("data:"):
            try:
                encabezado, data = imagen_base64.split(",", 1)
                content_type = encabezado.split(";")[0].split(":")[1]
            except (ValueError, IndexError):
                raise ValidationException("Formato de imagen base64 inválido")

        try:
            return content_type, base64.b64decode(data)
        except Exception:
            raise ValidationException("La imagen no es un base64 válido")

    def _extension(self, content_type: str) -> str:
        tipo = content_type.split("/")[-1].lower()
        return EXTENSIONES_PERMITIDAS.get(tipo, "jpg")
