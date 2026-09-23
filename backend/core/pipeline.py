from services.embedding_factory import create_embedding_model
from rag.vector_store import load_vector_store
from rag.retriever import create_retriever
from rag.generator import get_llm, get_prompt


class RAGPipeline:

    def __init__(self):

        print("Loading AI Pipeline...")

        self.embedding_model = create_embedding_model()

        self.vector_store = load_vector_store(
            self.embedding_model
        )

        self.retriever = create_retriever(
            self.vector_store
        )

        self.prompt = get_prompt()

        self.llm = get_llm()

        print("Pipeline Ready")