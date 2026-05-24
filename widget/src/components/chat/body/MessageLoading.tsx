interface MessageLoadingProps extends React.HTMLAttributes<HTMLDivElement> {}
const MessageLoadingComponent: React.FC<MessageLoadingProps> = () => {
  return (
    <div
      className={
        "max-w-[82%] whitespace-pre-wrap wrap-break-word rounded-3xl px-4 py-3 text-sm leading-5 self-start border border-slate-200 bg-white text-slate-800 rounded-bl-sm shadow-lg"
      }
    >
      <div className="flex items-center gap-1">
        <span className="size-1 rounded-full bg-slate-300 animate-bounce [animation-delay:0ms]" />
        <span className="size-1 rounded-full bg-slate-300 animate-bounce [animation-delay:150ms]" />
        <span className="size-1 rounded-full bg-slate-300 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
};

export default MessageLoadingComponent;
