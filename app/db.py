# app/db.py

import os
import psycopg
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("SUPABASE_DB_URL")


def get_connection():
    if not DATABASE_URL:
        raise RuntimeError("SUPABASE_DB_URL is not set")

    return psycopg.connect(DATABASE_URL)


def save_qa(
    question, answer, telegram_user_id=None, telegram_chat_id=None, username=None
):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                insert into qa_logs (
                    telegram_user_id,
                    telegram_chat_id,
                    username,
                    question,
                    answer
                )
                values (%s, %s, %s, %s, %s)
                """,
                (
                    telegram_user_id,
                    telegram_chat_id,
                    username,
                    question,
                    answer,
                ),
            )


def save_chat_message(session_id, role, content):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                insert into chat_messages (
                    session_id,
                    role,
                    content
                )
                values (%s, %s, %s)
                returning id, created_at
                """,
                (
                    session_id,
                    role,
                    content,
                ),
            )

            message_id, created_at = cur.fetchone()

    return {
        "id": message_id,
        "created_at": created_at,
    }


def get_recent_chat_messages(session_id, limit=6):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                select role, content
                from chat_messages
                where session_id = %s
                order by created_at desc
                limit %s
                """,
                (
                    session_id,
                    limit,
                ),
            )

            rows = cur.fetchall()

    return [
        {
            "role": role,
            "content": content,
        }
        for role, content in reversed(rows)
    ]


def update_chat_message_feedback(session_id, message_id, feedback):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                update chat_messages
                set feedback = %s
                where id = %s
                  and session_id = %s
                  and role = 'assistant'
                returning id
                """,
                (
                    feedback,
                    message_id,
                    session_id,
                ),
            )

            return cur.fetchone() is not None
