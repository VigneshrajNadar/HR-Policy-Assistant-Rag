from langchain_community.document_loaders import PyPDFLoader
from pathlib import Path


def load_document(file_path: str):

    loader = PyPDFLoader(file_path)

    return loader.load()


def load_documents(folder_path: str):

    documents = []

    pdf_files = Path(folder_path).glob("*.pdf")

    for pdf in pdf_files:

        print(f"Loading: {pdf.name}")

        docs = load_document(str(pdf))

        documents.extend(docs)

    return documents