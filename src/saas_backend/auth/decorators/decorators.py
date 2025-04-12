from typing import Any, Callable, TypeVar, cast
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from functools import wraps

from saas_backend.auth.models import User
from saas_backend.logger import LOG
from saas_backend.auth.user_manager.user_manager import UserManager

F = TypeVar("F", bound=Callable[..., Any])


def requires_credit(decrement: bool = True) -> Callable[[F], F]:
    """
    Decorator factory that requires a user to have credits to use the function.

    If decrement is True, the user's credits will be decremented.
    Attaches the user's credits to the response.
    """

    def decorator(func: F) -> F:
        @wraps(func)
        async def wrapper(*args: Any, **kwargs: Any) -> Any:
            user = kwargs.get("user")

            if user is None:
                raise HTTPException(status_code=401, detail="Invalid token")

            user = cast(User, user)

            LOG.info(f"User: {user.username}, has {user.credits} credits")

            if user.credits == 0:
                raise HTTPException(status_code=403, detail="User has no credits")

            result = await func(*args, **kwargs)

            if decrement:
                UserManager.decrement_user_credits(user.id)
                result["credits"] = user.credits - 1
            else:
                result["credits"] = user.credits

            return JSONResponse(content=result)

        return wrapper  # pyright: ignore[reportReturnType]

    return decorator
