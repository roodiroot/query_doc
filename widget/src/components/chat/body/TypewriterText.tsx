import { useEffect, useRef, useState } from "react";

type TypewriterTextProps = {
  text: string;
  speed?: number;
  animate?: boolean;
  onComplete?: () => void;
};

const TypewriterText = ({ text, speed = 20, animate = false, onComplete }: TypewriterTextProps) => {
  const [visibleText, setVisibleText] = useState(animate ? "" : text);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!animate) {
      setVisibleText(text);
      return;
    }

    setVisibleText("");

    let index = 0;

    const interval = setInterval(() => {
      index += 1;
      setVisibleText(text.slice(0, index));

      if (index >= text.length) {
        clearInterval(interval);
        onCompleteRef.current?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, animate]);

  return <span className="whitespace-pre-wrap">{visibleText}</span>;
};

export default TypewriterText;
