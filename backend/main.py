import os
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["VECLIB_MAXIMUM_THREADS"] = "1"
os.environ["NUMEXPR_NUM_THREADS"] = "1"
os.environ["ANONYMIZED_TELEMETRY"] = "False"
os.environ["MALLOC_ARENA_MAX"] = "2"

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings

from api.chat import router as chat_router
from api.stream import router as stream_router
from api.upload import router as upload_router


app = FastAPI(
    title="HR Policy Assistant",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "https://hr-policy-assistant-rag.vercel.app",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_origin_regex=r"(http://(localhost|127\.0\.0\.1):\d+|https://.*\.vercel\.app)",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    chat_router
)

app.include_router(
    stream_router
)

app.include_router(
    upload_router
)


@app.get("/")
def home():

    return {
        "message": "HR Policy Assistant API Running"
    }


@app.get("/health")
def health():

    return {
        "status": "ok"
    }
