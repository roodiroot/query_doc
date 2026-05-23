.PHONY: install build-widget start bot web

install:
	cd widget && npm install

build-widget:
	cd widget && npm run build

start: build-widget
	exec venv/bin/python run_all.py

bot:
	exec venv/bin/python -m bot.telegram

web: build-widget
	exec venv/bin/python -m web.server
