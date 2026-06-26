# Centro de Acopio — Guía para Claude

## Propósito del Proyecto

Sistema de gestión de **centro de acopio de donaciones** para apoyo ante desastre en Venezuela. Permite registrar, consultar y controlar el inventario de artículos donados (productos) en un centro de recepción.

**Urgencia:** Proyecto de emergencia humanitaria — priorizar velocidad de entrega sobre perfección.

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| API | FastAPI 0.115 |
| ORM | SQLModel 0.0.22 (SQLAlchemy + Pydantic combinados) |
| Base de datos | PostgreSQL (async via asyncpg) |
| Python | 3.12 |
| Gestor de deps | **uv** (NO usar pip) |
| Contenedor | Docker |
| Migraciones | Alembic |
| Tests | pytest + SQLite en memoria |
| Linter | Ruff |

## Estructura del Proyecto

```
centro acopio/
└── Back/                          # Backend FastAPI
    ├── app/
    │   ├── main.py                # Punto de entrada FastAPI
    │   ├── api/
    │   │   ├── deps.py            # Inyección de dependencias centralizada
    │   │   ├── health.py          # GET /health
    │   │   └── productos.py       # CRUD endpoints de artículos
    │   ├── db/
    │   │   └── sessions.py        # Engine async + get_db()
    │   ├── models/
    │   │   ├── producto.py        # Modelo DB + Schemas API (SQLModel)
    │   │   └── api_response.py    # APIResponse[T] genérico
    │   ├── repositories/
    │   │   └── producto_repository.py
    │   ├── services/
    │   │   └── producto/
    │   │       ├── producto_service.py   # Fachada
    │   │       ├── crear_producto.py
    │   │       ├── leer_producto.py
    │   │       ├── actualizar_producto.py
    │   │       └── eliminar_producto.py
    │   └── exceptions.py
    ├── shared/
    │   └── config.py              # PROJECT_NAME, VERSION, DATABASE_URL
    ├── alembic/                   # Migraciones DB
    ├── tests/
    │   ├── conftest.py            # Fixtures: db_session, repo, service
    │   ├── services/
    │   └── repositories/
    ├── Docker/
    │   ├── local/
    │   ├── test/
    │   └── prod/
    ├── docker-compose.local.yml
    ├── docker-compose.test.yml
    ├── docker-compose.prod.yml
    ├── pyproject.toml
    └── uv.lock
```

## Arquitectura

```
Request → Router (api/) → Service (facade) → Use Case → Repository → DB
```

- **Repository**: acceso a datos puro, sin lógica de negocio
- **Use Cases** (`crear_producto.py`, etc.): lógica de negocio, validaciones
- **Service** (`ProductoService`): fachada que agrupa los use cases (`service.crear`, `service.leer`, etc.)
- **API Response**: siempre `APIResponse[T]` con `success`, `message`, `outcome: list[T]`

## Estado Actual — Qué Está Hecho

- [x] CRUD completo de `Producto` (artículos de donación): crear, listar, obtener por ID, buscar por nombre, bajo stock, actualizar, eliminar
- [x] Endpoint `GET /health`
- [x] Respuesta genérica `APIResponse[T]`
- [x] DB async (asyncpg + PostgreSQL, SQLite en tests)
- [x] Migraciones Alembic (`f319f149c3c3_initial_migration.py`)
- [x] Tests unitarios de servicios y repositorios
- [x] Docker para local, test y prod
- [ ] **Frontend** — NO existe todavía
- [ ] Autenticación/auth — NO implementada
- [ ] Modelo adaptado al dominio de donaciones (actualmente usa `precio` que puede no aplicar)

## Deuda Técnica Conocida

Los siguientes archivos aún tienen referencias al proyecto original "Cronicos" y deben actualizarse:
- `shared/config.py` → `PROJECT_NAME = "Cronicos"`, `DESCRIPTION = "Sistema de Pacientes Cronicos..."`
- `pyproject.toml` → `description = "FastAPI backend for chronic patients management"`
- `Back/README.md` → título dice "Chronics Backend"

## Comandos Clave

```bash
# Desde Back/
cd Back

# Instalar dependencias
uv sync

# Levantar local (sin DB externa — necesita .env con DATABASE_URL)
uv run uvicorn app.main:app --reload --port 8020

# Levantar con Docker (local)
docker compose -f docker-compose.local.yml up --build

# Levantar con Docker (test)
docker compose -f docker-compose.test.yml up --build

# Ejecutar tests
uv run pytest -v

# Tests con cobertura
uv run pytest --cov=app --cov-report=term-missing

# Linter + formato (correr antes de commit)
uv run ruff check . --fix && uv run ruff format .

# Nueva migración
uv run alembic revision --autogenerate -m "descripcion"

# Aplicar migraciones
uv run alembic upgrade head
```

## Endpoints Actuales

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Raíz — mensaje de bienvenida |
| GET | `/health` | Health check |
| POST | `/api/v1/productos/` | Crear artículo |
| GET | `/api/v1/productos/` | Listar artículos (skip/limit) |
| GET | `/api/v1/productos/buscar?nombre=X` | Buscar por nombre |
| GET | `/api/v1/productos/bajo-stock?umbral=10` | Artículos con stock bajo |
| GET | `/api/v1/productos/{id}` | Obtener por ID |
| PUT | `/api/v1/productos/{id}` | Actualizar artículo |
| DELETE | `/api/v1/productos/{id}` | Eliminar artículo |

## Modelo de Datos — Producto (artículo de donación)

```python
class Producto:
    id: UUID
    nombre: str          # ej: "Agua mineral 500ml"
    descripcion: str     # opcional
    precio: Decimal      # puede reinterpretarse como valor estimado
    stock: int           # cantidad disponible en el centro
    created_at: datetime
    updated_at: datetime
```

## Variables de Entorno (.env en Back/)

```
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

## Convenciones del Código

- **snake_case** para variables y funciones
- **PascalCase** para clases
- **Type hints** en todas las firmas
- Imports absolutos desde raíz (`from app.db.sessions import get_db`)
- Validación de reglas de negocio en el **service**, no en el schema
- Endpoints siempre `async`
- Todo código y mensajes en **español**

## Agregar una Nueva Entidad (guía rápida)

1. Crear `app/models/<entidad>.py` con modelo DB + schemas API
2. Crear `app/repositories/<entidad>_repository.py`
3. Crear `app/services/<entidad>/` con use cases + fachada
4. Crear `app/api/<entidad>.py` y registrar en `main.py`
5. Agregar deps en `app/api/deps.py`
6. Generar y aplicar migración: `uv run alembic revision --autogenerate -m "add <entidad>"`
7. Escribir tests en `tests/`

## Tests

- Fixture `db_session`: SQLite en memoria (NO PostgreSQL)
- Fixture `repo`: `ProductoRepository(db_session)`
- Fixture `service`: `ProductoService(repo)`
- Los tests de servicios usan `pytest-asyncio` con `asyncio_mode = "auto"`
