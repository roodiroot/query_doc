import { MESSANGE_QUERYES, QUERYES } from "../../../constance/faq";

interface ChatTagsProps extends React.HTMLAttributes<HTMLDivElement> {
  onTagClick?: (value: string) => void;
  isLoading?: boolean;
}

const ChatTags: React.FC<ChatTagsProps> = ({ onTagClick, isLoading }) => {
  return (
    <div className="overflow-x-auto scrollbar-hide pl-2">
      <div className="flex gap-1 py-2">
        {MESSANGE_QUERYES.map((i) => (
          <a
            key={i.title}
            href={i.link}
            target="_blank"
            style={i.style}
            className="relative cursor-pointer font-semibold text-xs rounded-full px-3 py-1 whitespace-nowrap"
          >
            {i.title}
          </a>
        ))}
        {QUERYES.map((i) => (
          <button
            key={i}
            type="submit"
            disabled={isLoading}
            onClick={() => onTagClick?.(i)}
            style={{ color: "black" }}
            className="relative cursor-pointer text-black font-medium text-xs rounded-full px-3 py-1 whitespace-nowrap after:z-0 after:absolute after:inset-0 after:bg-slate-200 after:rounded-full"
          >
            <span className="relative z-10">{i}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatTags;
