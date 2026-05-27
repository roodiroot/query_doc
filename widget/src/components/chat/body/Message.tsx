import { cn } from "../../../lib/utils";
import type { Message, MessageFeedback } from "../../../types/general";
import Icons from "../../ui/Icons";
// import TypewriterText from "./TypewriterText";
import MarkdownMessage from "./MarkdownMessage";

interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  isUser: boolean;
  message: Message;
  shouldType?: boolean;
  onFeedback?: (messageId: number | null | undefined, feedback: MessageFeedback) => void;
  onTypingComplete?: () => void;
}
const MessageComponent: React.FC<MessageProps> = ({
  message,
  isUser,
  onFeedback,
  // shouldType,
  // onTypingComplete,
}) => {
  const messageTime = message.createdAt
    ? new Intl.DateTimeFormat("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(message.createdAt))
    : "";

  return (
    <div
      className={cn(
        "max-w-[82%] wrap-break-words rounded-3xl px-4 py-3 text-sm leading-5 text-text-primary/90",
        isUser
          ? "self-end bg-message-user rounded-br-sm"
          : "self-start bg-message-ai rounded-bl-sm",
      )}
    >
      {isUser ? (
        <div>
          {message.text}
          <div className="mt-2 flex justify-end">
            <span className="text-xs text-balance text-text-secondary">{messageTime}</span>
          </div>
        </div>
      ) : (
        // <TypewriterText
        //   text={message.text}
        //   animate={shouldType}
        //   onComplete={onTypingComplete}
        // />
        <div>
          <MarkdownMessage text={message.text} />
          <div className="mt-2 flex items-center justify-between">
            <div className="text-xs text-text-secondary">{messageTime}</div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onFeedback?.(message.messageId, "like")}
                disabled={!message.messageId}
                className="disabled:cursor-default"
              >
                <Icons.tup
                  className={cn(
                    "cursor-pointer transition-colors",
                    message.feedback === "like"
                      ? "fill-text-primary"
                      : "fill-text-secondary hover:fill-text-primary",
                    !message.messageId && "cursor-default opacity-40",
                  )}
                />
              </button>

              <button
                type="button"
                onClick={() => onFeedback?.(message.messageId, "dislike")}
                disabled={!message.messageId}
                className="disabled:cursor-default"
              >
                <Icons.tdown
                  className={cn(
                    "cursor-pointer transition-colors",
                    message.feedback === "dislike"
                      ? "fill-text-primary"
                      : "fill-text-secondary hover:fill-text-primary",
                    !message.messageId && "cursor-default opacity-40",
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageComponent;
