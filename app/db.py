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
