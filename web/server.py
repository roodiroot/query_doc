import asyncio

from aiohttp import web
from pathlib import Path

from app.rag import ask
from app.db import (
    save_qa,
    save_chat_message,
    get_recent_chat_messages,
    update_chat_message_feedback,
)

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
    session_id = str(data.get("session_id", "")).strip()

    if not question:
        return web.json_response(
            {"error": "Вопрос не может быть пустым"},
            status=400,
        )

    if not session_id:
        return web.json_response(
            {"error": "ID сессии не может быть пустым"},
            status=400,
        )

    # Получаем сообщения по session_id
    try:
        recent_messages = await asyncio.to_thread(
            get_recent_chat_messages,
            session_id,
            6,
        )
    except Exception as e:
        print(f"Не удалось получить историю чата: {e}")
        recent_messages = []

    context_lines = []

    for message in recent_messages:
        role = "Пользователь" if message["role"] == "user" else "Ассистент"
        context_lines.append(f"{role}: {message['content']}")

    if context_lines:
        question_with_context = (
            "Короткий контекст предыдущей переписки:\n"
            + "\n".join(context_lines)
            + "\n\nНовый вопрос пользователя:\n"
            + question
        )
    else:
        question_with_context = question

    try:
        answer = await asyncio.to_thread(ask, question_with_context)
    except Exception:
        return web.json_response(
            {"error": "Не удалось получить ответ"},
            status=500,
        )

    # Сохряаняем лооги в БД
    try:
        await asyncio.to_thread(
            save_qa,
            question=question,
            answer=answer,
            username="web_widget",
        )
    except Exception as e:
        print(f"Не удалось сохранить QA в БД: {e}")

    # Сохраняем сообщения и сессию вБД

    assistant_message = None

    try:
        await asyncio.to_thread(
            save_chat_message,
            session_id,
            "user",
            question,
        )

        assistant_message = await asyncio.to_thread(
            save_chat_message,
            session_id,
            "assistant",
            answer,
        )
    except Exception as e:
        print(f"Не удалось сохранить историю чата: {e}")

    # Добавляем заголовки в ответ
    return web.json_response(
        {
            "answer": answer,
            "message_id": assistant_message["id"] if assistant_message else None,
            "created_at": (
                assistant_message["created_at"].isoformat()
                if assistant_message
                else None
            ),
        },
        headers={
            "Access-Control-Allow-Origin": "*",
        },
    )


async def feedback_handler(request):
    try:
        data = await request.json()
    except Exception:
        return web.json_response(
            {"error": "Некорректный JSON"},
            status=400,
            headers={
                "Access-Control-Allow-Origin": "*",
            },
        )

    session_id = str(data.get("session_id", "")).strip()
    feedback = data.get("feedback")

    if feedback is not None:
        feedback = str(feedback).strip()

    try:
        message_id = int(data.get("message_id"))
    except Exception:
        message_id = None

    if not session_id:
        return web.json_response(
            {"error": "ID сессии не может быть пустым"},
            status=400,
            headers={
                "Access-Control-Allow-Origin": "*",
            },
        )

    if not message_id:
        return web.json_response(
            {"error": "ID сообщения не может быть пустым"},
            status=400,
            headers={
                "Access-Control-Allow-Origin": "*",
            },
        )

    if feedback not in ("like", "dislike", None):
        return web.json_response(
            {"error": "Некорректная реакция"},
            status=400,
            headers={
                "Access-Control-Allow-Origin": "*",
            },
        )

    try:
        updated = await asyncio.to_thread(
            update_chat_message_feedback,
            session_id,
            message_id,
            feedback,
        )
    except Exception as e:
        print(f"Не удалось сохранить реакцию: {e}")
        return web.json_response(
            {"error": "Не удалось сохранить реакцию"},
            status=500,
            headers={
                "Access-Control-Allow-Origin": "*",
            },
        )

    if not updated:
        return web.json_response(
            {"error": "Сообщение не найдено"},
            status=404,
            headers={
                "Access-Control-Allow-Origin": "*",
            },
        )

    return web.json_response(
        {"ok": True},
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

    app.router.add_post("/api/feedback", feedback_handler)
    app.router.add_options("/api/feedback", options_handler)

    return app
