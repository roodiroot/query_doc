import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownMessageProps = {
  text: string;
};

const MarkdownMessage = ({ text }: MarkdownMessageProps) => {
  return (
    <div className="markdown-message">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => (
            <a
              href={href}
              rel="noopener noreferrer"
              style={{
                color: "#4f46e5",
                textDecoration: "underline",
                textUnderlineOffset: "2px",
                fontWeight: "bold",
              }}
            >
              {children}
            </a>
          ),
          p: ({ children }) => (
            <p
              style={{
                margin: "0 0 4px 0",
              }}
            >
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul
              style={{
                margin: "0 0 4px 0",
                paddingLeft: "5px",
              }}
            >
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol
              style={{
                margin: "0 0 4px 0",
                paddingLeft: "0px",
              }}
            >
              {children}
            </ol>
          ),
          code: ({ children }) => (
            <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">{children}</code>
          ),
          pre: ({ children }) => (
            <pre className="my-2 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-white">
              {children}
            </pre>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownMessage;
