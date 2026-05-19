import os
from dotenv import load_dotenv
from openai import OpenAI

from app.config import CHAT_MODEL, MIN_SCORE, TOP_K
from app.search import search

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def ask(question: str) -> str:
    results = search(question, top_k=TOP_K)

    for result in results:
        print(result["title"], result["score"])

    results = [result for result in results if result["score"] >= MIN_SCORE]

    if not results:
        return "Информация по этому вопросу отсутствует в документе."

    context_parts = []

    for index, result in enumerate(results, start=1):
        context_parts.append(f"""
SOURCE {index}
TITLE: {result["title"]}
TEXT:
{result["text"]}
""")

    context = "\n\n".join(context_parts)

    response = client.responses.create(
        model=CHAT_MODEL,
        input=f"""
Ты отвечаешь только на основе контекста ниже.
Если просят материалы, просто отдавай ссылки. Без лишнего описания.
Если в контексте есть код, возвращай его как markdown code block, сохраняя тройные обратные кавычки и язык программирования.
Отвечай кратко.
Если ответа нет в контексте, скажи:
"Такой информации в документе нет.".
Не додумывай и не используй внешние знания.
Отвечай кратко.

КОНТЕКСТ:
{context}

ВОПРОС:
{question}
""",
    )

    return response.output_text
