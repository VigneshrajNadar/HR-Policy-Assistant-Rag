from langchain_groq import ChatGroq

from core.config import settings


def create_llm():

    return ChatGroq(
        model=settings.GROQ_MODEL,
        temperature=0,
        api_key=settings.GROQ_API_KEY,
    )