"""Role-Based Access Control (RBAC) with ownership and scope checks."""

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from services.auth import decode_access_token

security = HTTPBearer(auto_error=False)


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    payload = decode_access_token(credentials.credentials)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    return payload


class RBACPolicy:
    """Role + ownership + scope-based access control."""

    @staticmethod
    def require_role(*allowed_roles: str):
        """Check that the user has one of the allowed roles."""
        async def check(current_user: dict = Depends(get_current_user)):
            role = current_user.get("role")
            if role not in allowed_roles:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Insufficient role permissions. Required one of: {', '.join(allowed_roles)}"
                )
            return current_user
        return check

    @staticmethod
    def require_self_or_role(path_param_name: str = "student_id", *escalation_roles: str):
        """User can access their own resource, OR have an escalation role (e.g. admin)."""
        async def check(request: Request, current_user: dict = Depends(get_current_user)):
            resource_user_id = request.path_params.get(path_param_name)
            
            # Fallback to query parameter if not in path
            if not resource_user_id:
                resource_user_id = request.query_params.get(path_param_name)
                
            is_owner = current_user.get("user_id") == resource_user_id
            is_escalated = current_user.get("role") in escalation_roles
            
            if not (is_owner or is_escalated):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Access denied: not the owner and insufficient role for escalation"
                )
            return current_user
        return check

    @staticmethod
    def require_parent_of(path_param_name: str = "student_id"):
        """Parent can only access their linked child's data. Admin/Student owner also allowed."""
        async def check(request: Request, current_user: dict = Depends(get_current_user)):
            student_id = request.path_params.get(path_param_name) or request.query_params.get(path_param_name)
            
            role = current_user.get("role")
            if role == "admin":
                return current_user
                
            if role == "parent":
                linked_student_id = current_user.get("linked_student_id")
                if linked_student_id == student_id:
                    return current_user
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Access denied: parent is not linked to this student"
                )
                
            if role == "student" and current_user.get("user_id") == student_id:
                return current_user
                
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: insufficient permissions to access student data"
            )
        return check

    @staticmethod
    def require_professor_of(path_param_name: str = "course_id"):
        """Professor can only access their assigned courses. Admin also allowed."""
        async def check(request: Request, current_user: dict = Depends(get_current_user)):
            course_id = request.path_params.get(path_param_name) or request.query_params.get(path_param_name)
            
            role = current_user.get("role")
            if role == "admin":
                return current_user
                
            if role == "professor":
                assigned_courses = current_user.get("assigned_courses", [])
                if course_id in assigned_courses:
                    return current_user
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Access denied: professor is not assigned to course {course_id}"
                )
                
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: professor or admin role required"
            )
        return check
