from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from saas_backend.auth.router import router as auth_router
from dotenv import load_dotenv

from saas_backend.anime import anime_router
from saas_backend.startup import on_startup
from saas_backend.integrations import integrations_router

_ = load_dotenv()

app = FastAPI()

app.include_router(auth_router)
app.include_router(anime_router)
app.include_router(integrations_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


on_startup()


@app.get("/health")
def health_check():
    return {"message": "OK"}
