import { cn } from "../../../lib/utils";
import type { Message } from "../../../types/general";
import Icons from "../../ui/Icons";
// import TypewriterText from "./TypewriterText";
import MarkdownMessage from "./MarkdownMessage";

interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  isUser: boolean;
  message: Message;
  shouldType?: boolean;
  onTypingComplete?: () => void;
}
const MessageComponent: React.FC<MessageProps> = ({
  message,
  isUser,
  // shouldType,
  // onTypingComplete,
}) => {
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
        <div className="">
          {message.text}
          <div className="mt-2 flex justify-end">
            <span className="text-xs text-balance text-text-secondary">10:42</span>
          </div>
        </div>
      ) : (
        // <TypewriterText
        //   text={message.text}
        //   animate={shouldType}
        //   onComplete={onTypingComplete}
        // />
        <div className="">
          <MarkdownMessage text={message.text} />
          <div className="mt-2 flex items-center justify-between">
            <div className="text-xs text-text-secondary">10:42</div>
            <div className="flex gap-2">
              <Icons.tup className="fill-text-secondary hover:fill-text-primary cursor-pointer transition-colors" />
              <Icons.tdown className="fill-text-secondary hover:fill-text-primary cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageComponent;
