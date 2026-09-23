from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "openai/gpt-oss-20b"
    FRONTEND_URL: str = "http://localhost:5173"
    CHROMA_COLLECTION_NAME: str = "hr_policy_documents_minilm"
    
    class Config:
        env_file = ".env"

settings = Settings()