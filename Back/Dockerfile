FROM python:3.13-slim

WORKDIR /backend

# Copy configuration files first for Docker layer caching
COPY ./pyproject.toml ./
# Note: If your pyproject.toml references a README.md or setup.cfg, copy them here too

# Upgrade pip and install the dependencies defined in pyproject.toml
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir .

COPY . .

EXPOSE 8010

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8010"]