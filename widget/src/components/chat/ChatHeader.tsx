import { X } from "lucide-react";
import Icons from "../ui/Icons";

interface ChatHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  setIsOpen?: (value: boolean) => void;
  isLoading?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ isLoading, setIsOpen }) => {
  return (
    <header>
      <div
        style={{ borderBottom: "2px solid var(--color-border)" }}
        className="py-3 px-5 bg-background flex items-center justify-between "
      >
        <div className="flex items-center gap-4">
          <div className="size-12 bg-primary rounded-full flex justify-center items-center">
            <Icons.ai />
          </div>
          <div className="flex flex-col gap-0.5">
            <strong className="font-semibold leading-5 text-base">ИИ Агент</strong>
            <span className="text-sm leading-4 text-text-secondary">
              {isLoading ? (
                <span>Печатает...</span>
              ) : (
                <span className="flex items-center gap-2">
                  <span className="size-1.5 bg-green-400 rounded-full"></span>
                  Онлайн
                </span>
              )}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <div
            onClick={() => setIsOpen?.(false)}
            className="p-1.5 rounded-full cursor-pointer group hover:bg-indigo-200 transition-colors"
          >
            <X size={18} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
