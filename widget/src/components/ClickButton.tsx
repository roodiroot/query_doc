import { Sparkles, X } from "lucide-react";
import { cn } from "../lib/utils";

interface ClickButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  state?: boolean;
  setIsOpen?: (value: boolean) => void;
}
const ClickButton: React.FC<ClickButtonProps> = ({ state, setIsOpen, ...props }) => {
  return (
    <div
      {...props}
      aria-label="Открыть чат"
      onClick={() => (state ? setIsOpen?.(false) : setIsOpen?.(true))}
      className={cn(
        state ? "ml-auto mt-4 size-12" : "px-6 py-4 h-12",
        "cursor-pointer transition-all bg-indigo-600 overflow-hidden flex items-center text-sm justify-center gap-3 rounded-full border-0 font-medium text-white shadow-2xl shadow-indigo-500 hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-sky-200",
      )}
    >
      {state ? (
        <X size={24} />
      ) : (
        <>
          <Sparkles size={24} />
          Нужна помощь?
        </>
      )}
    </div>
  );
};

export default ClickButton;
