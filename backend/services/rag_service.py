import json

from chromadb.errors import InvalidArgumentError

from core.pipeline import RAGPipeline

from rag.generator import get_question_rewrite_prompt
from schemas.chat import ChatHistoryMessage
from schemas.chat import ChatResponse


STREAM_SOURCES_MARKER = "__CHAT_SOURCES__:"
MAX_HISTORY_MESSAGES = 8
MAX_HISTORY_CHARS = 4000


class RAGService:

    def __init__(self):

        print("Loading AI Engine...")

        self.pipeline = RAGPipeline()

        self.embedding_model = self.pipeline.embedding_model

        self.vector_store = self.pipeline.vector_store

        self.retriever = self.pipeline.retriever

        self.prompt = self.pipeline.prompt

        self.llm = self.pipeline.llm

        self.question_rewrite_prompt = get_question_rewrite_prompt()

        print("AI Engine Ready")

    def refresh(self):

        self.pipeline = RAGPipeline()

        self.embedding_model = self.pipeline.embedding_model

        self.vector_store = self.pipeline.vector_store

        self.retriever = self.pipeline.retriever

        self.prompt = self.pipeline.prompt

        self.llm = self.pipeline.llm

        self.question_rewrite_prompt = get_question_rewrite_prompt()

    def _retrieve_documents(self, question: str):

        try:
            return self.retriever.invoke(question)

        except InvalidArgumentError:
            from services.upload_service import UploadService

            UploadService().rebuild_index()

            self.refresh()

            return self.retriever.invoke(question)

    def _format_history(
        self,
        history: list[ChatHistoryMessage] | None
    ) -> str:

        if not history:
            return "No prior conversation."

        lines = []

        for message in history[-MAX_HISTORY_MESSAGES:]:

            role = "Assistant" if message.role == "assistant" else "User"
            content = " ".join(message.message.split())

            if content:
                lines.append(f"{role}: {content}")

        formatted = "\n".join(lines)

        if not formatted:
            return "No prior conversation."

        return formatted[-MAX_HISTORY_CHARS:]

    def _create_retrieval_question(
        self,
        question: str,
        chat_history: str
    ) -> str:

        if chat_history == "No prior conversation.":
            return question

        prompt = self.question_rewrite_prompt.invoke(
            {
                "chat_history": chat_history,
                "question": question
            }
        )

        response = self.llm.invoke(prompt)

        rewritten_question = response.content.strip()

        return rewritten_question or question

    def _collect_sources(self, docs):

        sources = []

        for doc in docs:

            source = (
                f"{doc.metadata.get('source')} "
                f"(Page {doc.metadata.get('page')})"
            )

            if source not in sources:
                sources.append(source)

        return sources

    def ask(
        self,
        question: str,
        history: list[ChatHistoryMessage] | None = None
    ) -> ChatResponse:

        chat_history = self._format_history(history)
        retrieval_question = self._create_retrieval_question(
            question,
            chat_history
        )

        docs = self._retrieve_documents(retrieval_question)

        context = "\n\n".join(
            doc.page_content
            for doc in docs
        )

        final_prompt = self.prompt.invoke(
            {
                "chat_history": chat_history,
                "context": context,
                "question": question
            }
        )

        response = self.llm.invoke(
            final_prompt
        )

        return ChatResponse(
            answer=response.content,
            sources=self._collect_sources(docs)
        )

    def stream_answer(
        self,
        question: str,
        history: list[ChatHistoryMessage] | None = None
    ):

        chat_history = self._format_history(history)
        retrieval_question = self._create_retrieval_question(
            question,
            chat_history
        )

        docs = self._retrieve_documents(retrieval_question)

        context = "\n\n".join(
            doc.page_content
            for doc in docs
        )

        final_prompt = self.prompt.invoke(
            {
                "chat_history": chat_history,
                "context": context,
                "question": question
            }
        )

        sources = self._collect_sources(docs)

        for chunk in self.llm.stream(
            final_prompt
        ):
            if chunk.content:
                yield chunk.content

        yield f"\n\n{STREAM_SOURCES_MARKER}{json.dumps(sources)}"
