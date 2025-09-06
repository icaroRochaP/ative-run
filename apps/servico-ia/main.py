"""
Ative Run - Serviço de IA
FastAPI application para processamento de treinos e análise por IA
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import users, strava, webhooks, analysis

app = FastAPI(
    title="Ative Run - Serviço de IA",
    description="API para processamento de treinos e análise por IA usando CrewAI",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(strava.router, prefix="/api/strava", tags=["strava"])
app.include_router(webhooks.router, prefix="/api/webhooks", tags=["webhooks"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["analysis"])

@app.get("/")
async def root():
    return {"message": "Ative Run - Serviço de IA está rodando!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
