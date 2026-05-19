import numpy as np
from app.embeddings import embed_texts
from app.synonyms import SYNONYMS
from indexing.index_store import load_index


def cosine_similarity(a: list[float], b: list[float]) -> float:
    a = np.array(a)
    b = np.array(b)

    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))


def expand_query(query: str) -> str:
    expanded = [query]

    lowered_query = query.lower()

    for word, synonyms in SYNONYMS.items():
        if word in lowered_query:
            expanded.extend(synonyms)

    return " ".join(expanded)


def search(query: str, top_k: int = 5) -> list[dict]:
    index = load_index()

    expanded_query = expand_query(query)
    query_vector = embed_texts([expanded_query])[0]

    results = []

    for item in index:
        score = cosine_similarity(query_vector, item["embedding"])

        results.append(
            {
                "title": item["title"],
                "chunk_index": item["chunk_index"],
                "text": item["text"],
                "score": score,
            }
        )

    results.sort(key=lambda item: item["score"], reverse=True)

    return results[:top_k]
