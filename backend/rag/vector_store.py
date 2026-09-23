from langchain_chroma import Chroma
from core.config import settings


def create_vector_store(chunks, embedding_model):
    return Chroma.from_documents(
        documents=chunks,
        embedding=embedding_model,
        persist_directory="./chroma_db",
        collection_name=settings.CHROMA_COLLECTION_NAME
    )


def add_documents_to_store(vector_store, chunks, ids=None):

    return vector_store.add_documents(
        documents=chunks,
        ids=ids
    )


def delete_documents_by_source(vector_store, source_path: str):

    try:

        vector_store.delete(
            where={"source": source_path}
        )

    except Exception:

        collection = getattr(vector_store, "_collection", None)

        if collection is None:
            raise

        collection.delete(
            where={"source": source_path}
        )


def load_vector_store(embedding_model):
    return Chroma(
        persist_directory="./chroma_db",
        embedding_function=embedding_model,
        collection_name=settings.CHROMA_COLLECTION_NAME
    )
