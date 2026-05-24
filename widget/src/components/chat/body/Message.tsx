import { cn } from "../../../lib/utils";
import type { Message } from "../../../types/general";
import TypewriterText from "./TypewriterText";

interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  isUser: boolean;
  message: Message;
  shouldType?: boolean;
  onTypingComplete?: () => void;
}
const MessageComponent: React.FC<MessageProps> = ({
  message,
  isUser,
  shouldType,
  onTypingComplete,
}) => {
  return (
    <div
      className={cn(
        "max-w-[82%] whitespace-pre-wrap wrap-break-word rounded-3xl px-4 py-3 text-sm leading-5",
        isUser
          ? "self-end bg-indigo-600 text-white rounded-br-sm shadow-2xl"
          : "self-start border border-slate-200 bg-white text-slate-800 rounded-bl-sm shadow-lg",
      )}
    >
      {isUser ? (
        message.text
      ) : (
        <TypewriterText
          text={message.text}
          animate={shouldType}
          onComplete={onTypingComplete}
        />
      )}
    </div>
  );
};

export default MessageComponent;
