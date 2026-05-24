import asyncio

from aiohttp import web
from pathlib import Path

from app.rag import ask
from app.db import save_qa

BASE_DIR = Path(__file__).resolve().parent.parent
WIDGET_PATH = BASE_DIR / "widget" / "dist" / "widget.js"


async def widget_handler(request):
    return web.FileResponse(WIDGET_PATH)


async def ask_handler(request):
    try:
        data = await request.json()
    except Exception:
        return web.json_response(
            {"error": "Некорректный JSON"},
            status=400,
        )

    question = str(data.get("question", "")).strip()

    if not question:
        return web.json_response(
            {"error": "Вопрос не может быть пустым"},
            status=400,
        )

    try:
        answer = await asyncio.to_thread(ask, question)
    except Exception:
        return web.json_response(
            {"error": "Не удалось получить ответ"},
            status=500,
        )

    try:
        await asyncio.to_thread(
            save_qa,
            question=question,
            answer=answer,
            username="web_widget",
        )
    except Exception as e:
        print(f"Не удалось сохранить QA в БД: {e}")

    return web.json_response(
        {"answer": answer},
        headers={
            "Access-Control-Allow-Origin": "*",
        },
    )


async def options_handler(request):
    return web.Response(
        status=204,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
        },
    )


def create_app():
    app = web.Application()

    app.router.add_get("/widget.js", widget_handler)
    app.router.add_post("/api/ask", ask_handler)
    app.router.add_options("/api/ask", options_handler)

    return app
