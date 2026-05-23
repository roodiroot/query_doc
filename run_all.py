import os
import asyncio
import signal

from aiohttp import web

from bot.telegram import main as telegram_main
from web.server import create_app
from dotenv import load_dotenv

load_dotenv()

PORT = os.getenv("WIDGET_PORT")


async def web_main(stop_event):
    app = create_app()

    runner = web.AppRunner(app)
    await runner.setup()

    site = web.TCPSite(runner, "0.0.0.0", PORT)
    await site.start()

    print("Web server started on http://0.0.0.0:" + PORT)

    try:
        await stop_event.wait()
    finally:
        await runner.cleanup()
        print("Web server stopped")


async def main():
    stop_event = asyncio.Event()

    loop = asyncio.get_running_loop()

    for sig in (signal.SIGINT, signal.SIGTERM):
        loop.add_signal_handler(sig, stop_event.set)

    tasks = [
        asyncio.create_task(web_main(stop_event)),
        asyncio.create_task(telegram_main(handle_signals=False)),
    ]

    await stop_event.wait()

    print("Stopping...")

    for task in tasks:
        task.cancel()

    await asyncio.gather(*tasks, return_exceptions=True)

    print("Stopped")


if __name__ == "__main__":
    asyncio.run(main())
