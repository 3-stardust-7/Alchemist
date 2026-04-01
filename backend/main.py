from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Autonomous Content Factory API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SourceDocument(BaseModel):
    content: str
    source_type: str = "text"  # "text" or "url"


@app.get("/")
def root():
    return {"status": "ok", "message": "Content Factory API is running"}


@app.post("/api/submit-document")
async def submit_document(payload: SourceDocument):
    """
    Receives the source document from the frontend.
    Currently echoes it back — agent pipeline goes here next.
    """
    print(f"[RECEIVED] source_type={payload.source_type}")
    print(f"[CONTENT PREVIEW] {payload.content[:200]}...")

    return {
        "status": "received",
        "source_type": payload.source_type,
        "char_count": len(payload.content),
        "message": "Document received. Agent pipeline will process this next.",
        "preview": payload.content[:100],
    }