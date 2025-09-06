"""
API routes para gerenciamento de usuários
"""
from fastapi import APIRouter

router = APIRouter()

@router.post("/")
async def create_user():
    """Criar novo usuário (chamado pelo bot WhatsApp)"""
    return {"message": "Usuário criado"}

@router.get("/{user_id}")
async def get_user(user_id: str):
    """Buscar dados do usuário"""
    return {"user_id": user_id}
