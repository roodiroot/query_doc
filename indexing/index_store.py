import json
from pathlib import Path
from app.config import INDEX_PATH


def save_index(chunks: list[dict], vectors: list[list[float]]) -> None:
    index = []

    for chunk, vector in zip(chunks, vectors):
        item = {
            "title": chunk["title"],
            "chunk_index": chunk["chunk_index"],
            "text": chunk["text"],
            "embedding": vector,
        }

        index.append(item)

    Path(INDEX_PATH).write_text(
        json.dumps(index, ensure_ascii=False, indent=2), encoding="utf-8"
    )


def load_index() -> list[dict]:
    raw = Path(INDEX_PATH).read_text(encoding="utf-8")

    index = json.loads(raw)

    return index
