import os
from dotenv import load_dotenv

_ = load_dotenv()


def get_secret():
    return os.getenv("JWT_SECRET", "cQMmaBUdU4M2i6CcPufbsr+ZJkmtux9wH8Y0ZaxQEKA=")


ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 120))
