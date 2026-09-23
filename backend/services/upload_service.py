from pathlib import Path
import re
import shutil

from fastapi import UploadFile

from services.embedding_factory import create_embedding_model
from rag.loader import load_document
from rag.splitter import split_documents
from rag.vector_store import (
    add_documents_to_store,
    delete_documents_by_source,
    load_vector_store
)


class UploadService:

    DOCUMENTS_DIR = Path("documents")
    SUPPORTED_EXTENSIONS = {".pdf"}


    def __init__(self):
        pass

    def _ensure_documents_dir(self):

        self.DOCUMENTS_DIR.mkdir(parents=True, exist_ok=True)


    def _safe_stem(self, filename: str):

        stem = Path(filename).stem

        safe_stem = re.sub(r"[^A-Za-z0-9_-]+", "_", stem).strip("_")

        return safe_stem or "document"


    def _validate_pdf(self, file: UploadFile):

        suffix = Path(file.filename or "").suffix.lower()

        if suffix not in self.SUPPORTED_EXTENSIONS:
            raise ValueError("Only PDF files are supported.")


    def _vector_store(self):

        return load_vector_store(
            create_embedding_model()
        )


    def list_uploaded_pdfs(self):

        self._ensure_documents_dir()

        return [
            {
                "filename": pdf.name
            }
            for pdf in sorted(self.DOCUMENTS_DIR.glob("*.pdf"))
        ]


    def save_pdf(self, file: UploadFile):

        self._validate_pdf(file)

        self._ensure_documents_dir()

        destination = self.DOCUMENTS_DIR / file.filename

        if destination.exists():

            delete_documents_by_source(
                self._vector_store(),
                str(destination)
            )

            destination.unlink()

        with open(destination, "wb") as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )

        return destination


    def index_pdf(self, pdf_path: Path):

        documents = load_document(str(pdf_path))

        chunks = split_documents(documents)

        if not chunks:

            return 0

        safe_stem = self._safe_stem(pdf_path.name)

        ids = []

        for index, chunk in enumerate(chunks):

            page_number = chunk.metadata.get("page", 0)

            ids.append(f"{safe_stem}-p{page_number}-c{index}")

        vector_store = self._vector_store()

        delete_documents_by_source(
            vector_store,
            str(pdf_path)
        )

        add_documents_to_store(
            vector_store,
            chunks,
            ids=ids
        )

        return len(chunks)


    def delete_pdf(self, filename: str):

        self._ensure_documents_dir()

        pdf_path = self.DOCUMENTS_DIR / filename

        delete_documents_by_source(
            self._vector_store(),
            str(pdf_path)
        )

        if pdf_path.exists():

            pdf_path.unlink()

        return pdf_path


    def rebuild_index(self):

        self._ensure_documents_dir()

        vector_store = self._vector_store()

        reset_collection = getattr(vector_store, "reset_collection", None)

        if callable(reset_collection):
            reset_collection()
            vector_store = self._vector_store()
        else:
            delete_collection = getattr(vector_store, "delete_collection", None)

            if callable(delete_collection):
                delete_collection()
                vector_store = self._vector_store()
            else:
                collection = getattr(vector_store, "_collection", None)

                if collection is not None:
                    collection.delete(where={})
                    vector_store = self._vector_store()

        total_chunks = 0

        for pdf_path in sorted(self.DOCUMENTS_DIR.glob("*.pdf")):

            documents = load_document(str(pdf_path))

            chunks = split_documents(documents)

            if not chunks:
                continue

            safe_stem = self._safe_stem(pdf_path.name)

            ids = []

            for index, chunk in enumerate(chunks):

                page_number = chunk.metadata.get("page", 0)

                ids.append(f"{safe_stem}-p{page_number}-c{index}")

            add_documents_to_store(
                vector_store,
                chunks,
                ids=ids
            )

            total_chunks += len(chunks)

        return total_chunks