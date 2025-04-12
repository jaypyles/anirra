from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from saas_backend.auth.router import router as auth_router
from dotenv import load_dotenv

_ = load_dotenv()

app = FastAPI()

app.include_router(auth_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"message": "OK"}
