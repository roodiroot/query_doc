# Docs FAQ Bot

Бот отвечает на вопросы по базе знаний из `data/docs.md`.

Проект работает по схеме:

```text
data/docs.md
-> indexing/build_index.py
-> data/rag_index.json
-> app/search.py
-> app/rag.py
-> bot/telegram.py
```

## Структура проекта

```text
docs_faq/
├── app/
│   ├── config.py
│   ├── embeddings.py
│   ├── rag.py
│   ├── search.py
│   └── synonyms.py
├── bot/
│   └── telegram.py
├── data/
│   ├── docs.md
│   └── rag_index.json
├── indexing/
│   ├── build_index.py
│   ├── chunker.py
│   ├── cleaner.py
│   ├── index_store.py
│   └── loader.py
├── main.py
├── requirements.txt
└── README.md
```

`app/` содержит основную RAG-логику: поиск, embeddings, промпт и настройки.

`indexing/` содержит всё для сборки индекса.

`bot/` содержит Telegram-бота.

`data/` содержит базу знаний и готовый индекс.

## 1. Подготовка окружения

Создай и активируй виртуальное окружение, если его ещё нет:

```bash
python3 -m venv venv
source venv/bin/activate
```

Установи зависимости:

```bash
pip install -r requirements.txt
```

Если при запуске появятся ошибки про отсутствующие модули, установи также:

```bash
pip install openai python-dotenv numpy
```

## 2. Настройка ключей

В корне проекта должен быть файл `.env`.

Пример содержимого:

```env
OPENAI_API_KEY=твой_ключ_openai
TG_BOT_TOKEN=твой_токен_telegram_бота
```

`OPENAI_API_KEY` нужен для создания embeddings и генерации ответов.

`TG_BOT_TOKEN` нужен для запуска Telegram-бота.

## 3. Обновление базы знаний

Основной документ базы знаний находится здесь:

```text
data/docs.md
```

Чтобы изменить знания бота, отредактируй `data/docs.md`.

После каждого изменения базы знаний нужно заново собрать индекс.

## 4. Запуск индексации

Индексация запускается из корня проекта:

```bash
venv/bin/python -m indexing.build_index
```

Если виртуальное окружение уже активировано:

```bash
python -m indexing.build_index
```

Что делает `indexing/build_index.py`:

```text
1. Читает data/docs.md
2. Очищает markdown через indexing/cleaner.py
3. Разбивает текст на чанки через indexing/chunker.py
4. Создаёт embeddings через app/embeddings.py
5. Сохраняет результат в data/rag_index.json
```

После успешного запуска файл `data/rag_index.json` будет перезаписан новым индексом.

## 5. Локальная проверка без Telegram

Для быстрой проверки можно запустить:

```bash
venv/bin/python main.py
```

Или при активированном окружении:

```bash
python main.py
```

Файл `main.py` вызывает функцию `ask()` и печатает ответ в терминал.

Тестовый вопрос можно поменять прямо в `main.py`.

## 6. Запуск Telegram-бота

Запуск бота из корня проекта:

```bash
venv/bin/python -m bot.telegram
```

Или при активированном окружении:

```bash
python -m bot.telegram
```

После запуска бот начнёт слушать сообщения в Telegram.

Команда `/start` отправляет приветствие.

Любой обычный текст отправляется в `ask()`, после чего бот возвращает ответ по базе знаний.

## 7. Когда нужно пересобирать индекс

Индекс нужно пересобирать, если ты:

- изменил `data/docs.md`;
- добавил новые разделы в базу знаний;
- поменял логику очистки markdown в `indexing/cleaner.py`;
- поменял разбиение текста в `indexing/chunker.py`;
- поменял модель embeddings в `app/config.py`.

Если меняется только `app/rag.py`, `bot/telegram.py` или промпт ответа, индекс пересобирать не нужно.

## 8. Частые проблемы

Если бот отвечает старой информацией, пересобери индекс:

```bash
venv/bin/python -m indexing.build_index
```

Если ошибка связана с OpenAI API, проверь `OPENAI_API_KEY` в `.env`.

Если Telegram-бот не запускается, проверь `TG_BOT_TOKEN` в `.env`.

Если команда `python` не работает, используй:

```bash
python3
```

