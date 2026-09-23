# HR Policy Assistant API

This document summarizes the public FastAPI endpoints exposed by the HR Policy Assistant backend.

Base URL for local development:

```text
http://127.0.0.1:8000
```

## Authentication

The application uses a Bring Your Own API Key flow. Requests that call OpenRouter-backed functionality should include the user's OpenRouter API key in the `Authorization` header:

```http
Authorization: Bearer sk-or-your-openrouter-key
```

Some chat requests may also include `api_key` in the JSON body, depending on the frontend flow.

## Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/` | Confirms the API is running. |
| `POST` | `/upload` | Uploads, chunks, embeds, and indexes a PDF. |
| `POST` | `/chat` | Returns a complete answer with source citations. |
| `POST` | `/chat/stream` | Streams an answer and appends source metadata. |
| `GET` | `/uploads` | Lists uploaded PDFs. |
| `DELETE` | `/uploads/{filename}` | Deletes a PDF and removes indexed vectors for that file. |
| `POST` | `/uploads/rebuild` | Rebuilds the vector index from uploaded PDFs. |
| `GET` | `/stream` | Development streaming test endpoint. |

## Upload PDF

```bash
curl -X POST http://127.0.0.1:8000/upload \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -F "file=@./backend/documents/IIA HR Policy.pdf"
```

Example response:

```json
{
  "filename": "IIA HR Policy.pdf",
  "message": "PDF uploaded and processed successfully",
  "chunks": 42
}
```

## Chat

```bash
curl -X POST http://127.0.0.1:8000/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -d '{
    "question": "What is the annual leave policy?",
    "history": []
  }'
```

Example response:

```json
{
  "answer": "Employees are eligible for annual leave according to the policy...",
  "sources": [
    "documents/IIA HR Policy.pdf (Page 3)"
  ]
}
```

## Stream Chat

```bash
curl -N -X POST http://127.0.0.1:8000/chat/stream \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -d '{
    "question": "Summarize the reimbursement policy.",
    "history": []
  }'
```

The streamed response ends with a source marker consumed by the frontend:

```text
__CHAT_SOURCES__:["documents/IIA HR Policy.pdf (Page 5)"]
```

## List Uploads

```bash
curl http://127.0.0.1:8000/uploads
```

## Delete Upload

```bash
curl -X DELETE http://127.0.0.1:8000/uploads/IIA%20HR%20Policy.pdf \
  -H "Authorization: Bearer $OPENROUTER_API_KEY"
```

## Rebuild Index

```bash
curl -X POST http://127.0.0.1:8000/uploads/rebuild \
  -H "Authorization: Bearer $OPENROUTER_API_KEY"
```

For interactive request and response schemas, run the backend and open `/docs`.
