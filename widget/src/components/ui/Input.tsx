const Input: React.FC<React.ComponentProps<"textarea">> = ({ ...props }) => {
  return (
    <textarea
      {...props}
      className="resize-none min-w-0 h-16 text-base sm:text-sm flex-1 py-2 text-slate-950 outline-none transition placeholder:text-slate-400 "
    />
  );
};

export default Input;
