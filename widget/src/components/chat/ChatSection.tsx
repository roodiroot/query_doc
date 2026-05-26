import { useMediaQuery } from "../../hooks/useMediaQuery";
import { cn } from "../../lib/utils";
import type { Message } from "../../types/general";

import ChatBody from "./body/ChatBody";
import ChatHeader from "./ChatHeader";
import ChatInput from "./input/ChatInput";
import ChatTags from "./input/ChatTags";

interface ChatSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean;
  setIsOpen?: (value: boolean) => void;
  messages?: Message[];
  text?: string;
  setText?: (value: string) => void;
  handleSubmit?: (event: React.SubmitEvent<HTMLFormElement>) => void;
  handleTagClick?: (value: string) => void;
  typingMessageId?: string | null;
  onTypingComplete?: () => void;
}
const ChatSection: React.FC<ChatSectionProps> = ({
  messages,
  isLoading,
  text,
  setIsOpen,
  setText,
  handleSubmit,
  handleTagClick,
  typingMessageId,
  onTypingComplete,
}) => {
  const isDesctop = useMediaQuery("(min-width: 640px)");

  return (
    <section
      className={cn(
        !isDesctop ? "fixed inset-0 h-dvh w-screen rounded-none border-0" : "sm:relative",
        "sm:relative sm:w-100 max-h-dvh sm:h-[calc(100vh-100px)] sm:shadow-lg sm:shadow-indigo-500/10 sm:rounded-chat transition-all overflow-hidden border border-border bg-background",
      )}
    >
      <div className="w-full h-full min-h-0 flex flex-col">
        <ChatHeader setIsOpen={setIsOpen} isLoading={isLoading} />
        <ChatBody
          isLoading={isLoading}
          messages={messages}
          typingMessageId={typingMessageId}
          onTypingComplete={onTypingComplete}
        />
        <ChatTags onTagClick={handleTagClick} />
        <ChatInput
          isLoading={isLoading}
          text={text}
          setText={setText}
          handleSubmit={handleSubmit}
        />
      </div>
    </section>
  );
};

export default ChatSection;
