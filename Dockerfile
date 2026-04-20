# ---------- Base ----------
FROM python:3.10-slim

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Working directory
WORKDIR /app

# System dependencies for OpenCV + torch
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy only backend (important)
COPY backend /app/backend

# Install python deps87
RUN pip install --upgrade pip
RUN pip install -r backend/requirements.txt

# Expose port
EXPOSE 10000

# Start FastAPI
WORKDIR /app/backend
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]
