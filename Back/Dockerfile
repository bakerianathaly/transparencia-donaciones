FROM python:3.13-slim

WORKDIR /backend

# Copy the pyproject.toml from the 'Back' folder relative to your repository root
COPY ./Back/pyproject.toml ./

# Upgrade pip and install dependencies natively
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir .

# Copy the contents of the 'Back' subfolder into the container's working directory
COPY ./Back/ .

EXPOSE 8010

# Command to run the FastAPI application using Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8010"]