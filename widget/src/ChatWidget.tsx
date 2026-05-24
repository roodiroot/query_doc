import { useEffect, useState } from "react";
import ClickButton from "./components/ClickButton";
import type { AskResponse } from "./types/general";
import ChatSection from "./components/chat/ChatSection";
import { useChatStore } from "./store/chatStore";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

console.log(apiBaseUrl);

export default function ChatWidget() {
  const { messages, setMessages } = useChatStore();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);

  async function sendMessage(value: string) {
    const trimmedText = value.trim();

    if (!trimmedText || isLoading) {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: crypto.randomUUID(),
        role: "user",
        text: trimmedText,
      },
    ]);

    setText("");
    setIsLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: trimmedText,
        }),
      });

      const data = (await response.json()) as AskResponse;

      if (!response.ok) {
        throw new Error(data.error || "Ошибка сервера");
      }

      const botMessageId = crypto.randomUUID();

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: botMessageId,
          role: "bot",
          text: data.answer || "Не удалось сформировать ответ.",
        },
      ]);

      setTypingMessageId(botMessageId);
    } catch (error) {
      console.error(error);

      const botMessageId = crypto.randomUUID();

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: botMessageId,
          role: "bot",
          text: "Не удалось получить ответ. Попробуйте ещё раз.",
        },
      ]);

      setTypingMessageId(botMessageId);
    } finally {
      setIsLoading(false);
    }
  }
  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(text);
  }
  function handleTagClick(value: string) {
    void sendMessage(value);
  }

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <div className="fixed font-sans bottom-5 right-5 z-9999 text-slate-900 sm:bottom-3 sm:right-3">
      {isOpen && (
        <ChatSection
          messages={messages}
          isLoading={isLoading}
          text={text}
          setIsOpen={setIsOpen}
          setText={setText}
          handleSubmit={handleSubmit}
          handleTagClick={handleTagClick}
          typingMessageId={typingMessageId}
          onTypingComplete={() => setTypingMessageId(null)}
        />
      )}
      <ClickButton state={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}
