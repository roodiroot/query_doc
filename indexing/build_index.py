from app.config import DOC_PATH
from app.embeddings import embed_texts
from indexing.chunker import make_chunks
from indexing.cleaner import clean_markdown
from indexing.index_store import save_index
from indexing.loader import read_markdown


def main():
    print("Читаю документ...")
    markdown = read_markdown(DOC_PATH)

    print("Очищаю markdown...")
    cleaned_markdown = clean_markdown(markdown)

    print("Разбиваю на чанки...")
    chunks = make_chunks(cleaned_markdown)

    print(f"Создано чанков: {len(chunks)}")

    print("Создаю embeddings...")
    texts = []

    for chunk in chunks:
        texts.append(chunk["text"])

    vectors = embed_texts(texts)

    print("Сохраняю индекс...")
    save_index(chunks, vectors)

    print("Готово. Индекс сохранён в data/rag_index.json")


if __name__ == "__main__":
    main()
