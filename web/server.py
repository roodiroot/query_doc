from aiohttp import web
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
WIDGET_PATH = BASE_DIR / "widget" / "dist" / "widget.js"


async def widget_handler(request):
    return web.FileResponse(WIDGET_PATH)


def create_app():
    app = web.Application()
    app.router.add_get("/widget.js", widget_handler)
    return app
