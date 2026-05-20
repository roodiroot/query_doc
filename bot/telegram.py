import os
import asyncio

import logging
from aiogram import Bot, Dispatcher, F
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart
from aiogram.types import Message
from dotenv import load_dotenv
from app.db import save_qa
from app.rag import ask

load_dotenv()

TOKEN = os.getenv("TG_BOT_TOKEN")


bot = Bot(token=TOKEN)
dp = Dispatcher()


@dp.message(CommandStart())
async def cmd_start(message: Message):
    await message.answer("Это бот нужен для нафигации по базе знаний K2-sales.spase")


@dp.message(F.text)
async def chat(message: Message):
    user_text = message.text
    if message.chat.type in ("group", "supergroup"):
        mention = f"@{BOT_USERNAME}"

        if mention not in user_text:
            return

        user_text = user_text.replace(mention, "").strip()

        if not user_text:
            return

    await bot.send_chat_action(chat_id=message.chat.id, action="typing")

    try:
        answer = await asyncio.to_thread(ask, user_text)
        await message.answer(answer)
        await asyncio.to_thread(
            save_qa,
            question=user_text,
            answer=answer,
            telegram_user_id=message.from_user.id if message.from_user else None,
            telegram_chat_id=message.chat.id,
            username=message.from_user.username if message.from_user else None,
        )

    except Exception as e:
        await message.answer(f"Ошибка: {e}")


async def main():
    global BOT_USERNAME
    logging.basicConfig(level=logging.INFO)

    me = await bot.get_me()
    BOT_USERNAME = me.username

    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
