import os
import asyncio

import logging
from aiogram import Bot, Dispatcher, F
from aiogram.filters import CommandStart
from aiogram.types import Message
from dotenv import load_dotenv
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
    await bot.send_chat_action(chat_id=message.chat.id, action="typing")

    try:
        answer = await asyncio.to_thread(ask, user_text)
        await message.answer(answer)

    except Exception as e:
        await message.answer(f"Ошибка: {e}")


async def main():
    logging.basicConfig(level=logging.INFO)
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
