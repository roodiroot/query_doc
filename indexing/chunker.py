import re

HEADING_RE = re.compile(r"^(#{1,6})\s+(.+?)\s*$")
HR_RE = re.compile(r"^\s*-{3,}\s*$")


def normalize_text(text: str) -> str:
    return re.sub(r"\n{3,}", "\n\n", text).strip()


def split_long_text(text: str, max_chars: int = 900) -> list[str]:
    paragraphs = [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]

    chunks = []
    current = ""

    for paragraph in paragraphs:
        if not current:
            current = paragraph
            continue

        candidate = current + "\n\n" + paragraph

        if len(candidate) <= max_chars:
            current = candidate
        else:
            chunks.append(current)
            current = paragraph

    if current:
        chunks.append(current)

    return chunks


def make_chunks(md: str):
    heading_stack = []
    buffer = []
    result = []

    def flush():
        nonlocal buffer

        body = normalize_text("\n".join(buffer))
        buffer = []

        if not body:
            return

        title = " > ".join(heading_stack)

        for part in split_long_text(body):
            # Заголовочный путь добавляем в embedding-текст,
            # чтобы поиск понимал модель, раздел и подраздел.
            text = f"{title}\n\n{part}" if title else part

            result.append(
                {
                    "title": title,
                    "chunk_index": len(result),
                    "text": text,
                }
            )

    for line in md.splitlines():
        heading_match = HEADING_RE.match(line)

        if heading_match:
            flush()

            level = len(heading_match.group(1))
            title = heading_match.group(2).strip()

            heading_stack = heading_stack[: level - 1]
            heading_stack.append(title)

            continue

        if HR_RE.match(line):
            flush()
            continue

        buffer.append(line)

    flush()

    return result
