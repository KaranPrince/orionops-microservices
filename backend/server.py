from fastapi import FastAPI
from pydantic import BaseModel
import os

# Initialize FastAPI application
app = FastAPI(title="OrionOps Backend Service")

# Pydantic model for structured, validated JSON response (Enterprise Standard)
class StatusResponse(BaseModel):
    service: str
    status: str
    environment: str
    message: str

# API Endpoint definition
@app.get("/api/v1/status", response_model=StatusResponse)
def get_status():
    """Returns the operational status of the backend service."""
    # Get environment name from OS variable, defaulting to a known value
    env = os.environ.get("ENV_NAME", "Development")
    return StatusResponse(
        service="OrionOps-Backend-API",
        status="Operational",
        environment=env,
        message="Data plane is running and ready for secure transactions."
    )

if __name__ == "__main__":
    import uvicorn
    # Use 0.0.0.0 for container accessibility
    uvicorn.run(app, host="0.0.0.0", port=8000)