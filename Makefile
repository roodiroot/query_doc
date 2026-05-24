.PHONY: build-index install build-widget start bot web

# запуск индексации базы
build-index:
	exec venv/bin/python -m indexing.build_index

# установка npm зависимостей для UI виджета
install:
	cd widget && npm install

# билд виджета
build-widget:
	cd widget && npm run build

# старт всего проекта
start: build-widget
	exec venv/bin/python run_all.py

# старт отделльно телеграм бота
bot:
	exec venv/bin/python -m bot.telegram

# старт отдельно веб сервера
web: build-widget
	exec venv/bin/python -m web.server
