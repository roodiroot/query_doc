import { useState } from "react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Здравствуйте! Я помощник. Задайте вопрос."
    }
  ]);
  const [text, setText] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedText = text.trim();

    if (!trimmedText) {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        role: "user",
        text: trimmedText
      },
      {
        role: "bot",
        text: "Это тестовый ответ. Позже здесь будет ответ от сервера."
      }
    ]);

    setText("");
  }

  return (
    <div className="chat-widget">
      {!isOpen && (
        <button className="chat-toggle" onClick={() => setIsOpen(true)}>
          ?
        </button>
      )}

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div>
              <strong>Помощник</strong>
              <span>Онлайн</span>
            </div>

            <button className="chat-close" onClick={() => setIsOpen(false)}>
              ×
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${message.role}`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <form className="chat-form" onSubmit={handleSubmit}>
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Напишите вопрос..."
            />

            <button type="submit">
              Отправить
            </button>
          </form>
        </div>
      )}
    </div>
  );
}