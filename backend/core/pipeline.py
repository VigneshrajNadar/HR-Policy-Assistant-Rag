from functools import lru_cache
from services.embedding_factory import get_embedding_model
from rag.vector_store import load_vector_store
from rag.retriever import create_retriever
from rag.generator import get_llm, get_prompt


class RAGPipeline:

    def __init__(self):

        print("Loading AI Pipeline components...")

        self.embedding_model = get_embedding_model()

        self.vector_store = load_vector_store()

        self.retriever = create_retriever(
            self.vector_store
        )

        self.prompt = get_prompt()

        self.llm = get_llm()

        print("Pipeline components loaded successfully")


@lru_cache(maxsize=1)
def get_rag_pipeline():
    print("Initializing RAG Pipeline (Singleton)...")
    return RAGPipeline()