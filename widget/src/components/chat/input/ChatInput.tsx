import Input from "../../ui/Input";

import { cn } from "../../../lib/utils";
import { ArrowUp, Trash } from "lucide-react";
import { useChatStore } from "../../../store/chatStore";

interface ChatInputProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean;
  text?: string;
  setText?: (value: string) => void;
  handleSubmit?: (event: React.SubmitEvent<HTMLFormElement>) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ isLoading, text, setText, handleSubmit }) => {
  const { clearMessages } = useChatStore();

  return (
    <div className="px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
      <form
        onSubmit={handleSubmit}
        className="relative border border-border bg-surface rounded-chat-min px-4 pt-4 pb-1"
      >
        <div className="flex gap-2 ">
          <Input
            value={text}
            onChange={(event) => setText?.(event.target.value)}
            placeholder="Задайте ваш вопрос..."
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading || !text?.trim()}
            className={cn(
              "group relative size-11 z-10 p-3 rounded-full overflow-hidden before:cursor-pointer before:absolute before:z-0 before:inset-0 before:bg-indigo-600 disabled:before:bg-indigo-300 disabled:before:cursor-default",
            )}
          >
            <ArrowUp
              size={20}
              className="relative z-10 text-white cursor-pointer group-disabled:cursor-auto"
            />
          </button>
        </div>
        <div
          onClick={clearMessages}
          className="group absolute hover:bg-indigo-100 transition-colors bottom-1 left-1 p-1.5 rounded-full cursor-pointer"
        >
          <Trash
            size={18}
            className="text-slate-400 group-hover:text-slate-900 transition-colors"
          />
        </div>

        <div className="text-xs text-slate-500 mt-3 text-center">
          ИИ-помощник. Перепроверяйте ответы при необходимости.
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
