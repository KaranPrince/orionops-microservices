# Stage 1: Builder - Install Dependencies (Leverages Docker cache)
FROM python:3.11-slim AS build
WORKDIR /app
COPY requirements.txt .
# Install dependencies with no cache for a smaller final image
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Final Image - Minimal runtime
FROM python:3.11-slim
WORKDIR /app
# Copy installed dependencies from the build stage (Best Practice for size optimization)
COPY --from=build /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY server.py .

EXPOSE 8000
# Exec form CMD is best practice for proper signal handling in containers
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]