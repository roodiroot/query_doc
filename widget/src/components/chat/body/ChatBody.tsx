import { useEffect, useRef } from "react";

import type { Message as MessageType } from "../../../types/general";
import MessageComponent from "./Message";
import MessageLoadingComponent from "./MessageLoading";

interface ChatBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean;
  messages?: MessageType[];
  typingMessageId?: string | null;
  onTypingComplete?: () => void;
}

const ChatBody: React.FC<ChatBodyProps> = ({
  isLoading,
  messages,
  typingMessageId,
  onTypingComplete,
  ...props
}) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const content = contentRef.current;

    if (!content) return;

    const scrollToBottom = () => {
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      });
    };

    scrollToBottom();

    const observer = new ResizeObserver(scrollToBottom);

    observer.observe(content);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      {...props}
      className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto p-3.5"
    >
      <div ref={contentRef} className="flex flex-col gap-2.5">
        {messages?.map((message, index) => {
          const isUser = message.role === "user";
          const messageKey = message.id || `${message.role}-${index}`;

          return (
            <MessageComponent
              key={messageKey}
              isUser={isUser}
              message={message}
              shouldType={message.id === typingMessageId}
              onTypingComplete={onTypingComplete}
            />
          );
        })}

        {isLoading && <MessageLoadingComponent />}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatBody;
