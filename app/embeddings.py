import os
from dotenv import load_dotenv
from openai import OpenAI
from app.config import EMBED_MODEL

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def embed_texts(texts: list[str]) -> list[list[float]]:
    response = client.embeddings.create(model=EMBED_MODEL, input=texts)

    embeddings = []

    for item in response.data:
        embeddings.append(item.embedding)

    return embeddings
