import { useEffect, useState } from "react";
import ClickButton from "./components/ClickButton";
import type { AskResponse, MessageFeedback } from "./types/general";
import ChatSection from "./components/chat/ChatSection";
import { useChatStore } from "./store/chatStore";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const sessionStorageKey = "chat-session-id";

function getChatSessionId() {
  const savedSessionId = localStorage.getItem(sessionStorageKey);

  if (savedSessionId) {
    return savedSessionId;
  }

  const sessionId = crypto.randomUUID();
  localStorage.setItem(sessionStorageKey, sessionId);

  return sessionId;
}

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
        createdAt: new Date().toISOString(),
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
          session_id: getChatSessionId(),
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
          messageId: data.message_id,
          role: "bot",
          text: data.answer || "Не удалось сформировать ответ.",
          createdAt: data.created_at || new Date().toISOString(),
          feedback: null,
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
          createdAt: new Date().toISOString(),
          feedback: null,
        },
      ]);

      setTypingMessageId(botMessageId);
    } finally {
      setIsLoading(false);
    }
  }

  async function sendFeedback(messageId: number | null | undefined, feedback: MessageFeedback) {
    if (!messageId) {
      return;
    }

    const currentMessage = messages.find((message) => message.messageId === messageId);
    const nextFeedback = currentMessage?.feedback === feedback ? null : feedback;

    setMessages((currentMessages) =>
      currentMessages.map((message) =>
        message.messageId === messageId
          ? {
              ...message,
              feedback: nextFeedback,
            }
          : message,
      ),
    );

    try {
      const response = await fetch(`${apiBaseUrl}/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: getChatSessionId(),
          message_id: messageId,
          feedback: nextFeedback,
        }),
      });

      if (!response.ok) {
        throw new Error("Не удалось сохранить реакцию");
      }
    } catch (error) {
      console.error(error);
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
    <div className="fixed font-sans bottom-5 right-5 z-9999 text-text-primary sm:bottom-3 sm:right-3">
      {isOpen && (
        <ChatSection
          messages={messages}
          isLoading={isLoading}
          text={text}
          onFeedback={sendFeedback}
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
