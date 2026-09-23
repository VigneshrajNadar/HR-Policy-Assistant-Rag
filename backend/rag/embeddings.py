from services.embedding_factory import create_embedding_model


def get_embedding_model(api_key: str):

    return create_embedding_model(api_key)
