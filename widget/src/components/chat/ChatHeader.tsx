import { X } from "lucide-react";

interface ChatHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  setIsOpen?: (value: boolean) => void;
  isLoading?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ isLoading, setIsOpen }) => {
  return (
    <header className="p-2 bg-transparent">
      <div className="rounded-2xl border border-slate-200 bg-white py-2 px-4 flex items-center justify-between ">
        <div className="flex flex-col gap-0.5">
          <strong className="font-semibold leading-5 text-base">TERRA-HOLOD AI</strong>
          <span className="text-sm leading-4 text-slate-400">
            {isLoading ? (
              <span>Печатает...</span>
            ) : (
              <span className="flex items-center gap-2">
                Онлайн
                <span className="size-1.5 bg-indigo-500 rounded-full"></span>
              </span>
            )}
          </span>
        </div>
        <div className="flex gap-2">
          <div
            onClick={() => setIsOpen?.(false)}
            className="p-1.5 rounded-full cursor-pointer -mr-3 -mt-4 group hover:bg-indigo-200 transition-colors"
          >
            <X size={18} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
