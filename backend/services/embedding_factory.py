from functools import lru_cache


@lru_cache(maxsize=1)
def get_embedding_model():

    from langchain_huggingface import HuggingFaceEmbeddings
    
    print("Initializing HuggingFaceEmbeddings (MiniLM)...")
    return HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )