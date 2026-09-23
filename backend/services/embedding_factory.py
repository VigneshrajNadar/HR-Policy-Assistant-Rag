from functools import lru_cache


@lru_cache(maxsize=1)
def get_embedding_model():

    import torch
    torch.set_num_threads(1)

    from langchain_huggingface import HuggingFaceEmbeddings
    
    print("Initializing HuggingFaceEmbeddings (MiniLM) on CPU...")
    return HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        model_kwargs={"device": "cpu"},
        encode_kwargs={"batch_size": 1},
    )