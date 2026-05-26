"""Authentication API routes."""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

from services.auth import auth_service, create_access_token, decode_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer()


class LoginRequest(BaseModel):
    email: str
    password: str
    role: str


class TokenRefreshRequest(BaseModel):
    refresh_token: str


class SwitchRoleRequest(BaseModel):
    new_role: str


@router.post("/login")
async def login(request: LoginRequest):
    try:
        return auth_service.login(request.email, request.password, request.role)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc


@router.post("/refresh")
async def refresh_token(request: TokenRefreshRequest):
    payload = decode_access_token(request.refresh_token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    access_token = create_access_token(
        data={"sub": payload.get("sub"), "user_id": payload.get("user_id"), "role": payload.get("role", "student")}
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/switch-role")
async def switch_role(request: SwitchRoleRequest, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = decode_access_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    try:
        return auth_service.switch_role(payload["user_id"], request.new_role)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.get("/me")
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = decode_access_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return {"user_id": payload.get("user_id"), "email": payload.get("sub"), "role": payload.get("role")}
