from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from schemas.chat import ChatRequest
from schemas.chat import ChatResponse
from services.rag_service import RAGService


router = APIRouter()


@router.post(
    "/chat",
    response_model=ChatResponse
)
def chat(
    request: ChatRequest
):

    try:

        rag = RAGService()

        return rag.ask(
            request.question,
            request.history
        )

    except Exception as error:
        print(f"Chat request failed: {error}")

        return ChatResponse(
            answer=(
                "I could not reach the AI service right now. "
                "Please check your internet connection, API key, or proxy settings, then try again."
            ),
            sources=[]
        )


@router.post("/chat/stream")
def stream_chat(
    request: ChatRequest
):

    rag = RAGService()

    return StreamingResponse(
        rag.stream_answer(
            request.question,
            request.history
        ),
        media_type="text/plain"
    )
