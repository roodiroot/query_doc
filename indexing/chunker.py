import re


def split_by_headers(md: str):
    pattern = r"^(#{1,6})\s+(.+)$"

    matches = list(re.finditer(pattern, md, flags=re.MULTILINE))

    sections = []

    for i, match in enumerate(matches):
        title = match.group(2)
        start = match.end()

        if i + 1 < len(matches):
            end = matches[i + 1].start()

        else:
            end = len(md)

        content = md[start:end].strip()
        sections.append({"title": title, "content": content})

    return sections


def split_text_into_chunks(text: str, max_chars: int = 1200, overlap: int = 200):
    chunks = []
    start = 0

    while start < len(text):
        end = start + max_chars
        chunk = text[start:end].strip()

        if chunk:
            chunks.append(chunk)

        start = start + max_chars - overlap

    return chunks


def make_chunks(md: str):
    sections = split_by_headers(md)
    result = []

    for section in sections:
        small_chunks = split_text_into_chunks(section["content"])

        for index, chunk in enumerate(small_chunks):
            result.append(
                {"title": section["title"], "chunk_index": index, "text": chunk}
            )

    return result
