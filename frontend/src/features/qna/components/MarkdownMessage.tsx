import type { JSX } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

import "highlight.js/styles/github-dark.css";

type MarkdownMessageProps = {
  content: string;
};

type AnchorProps = ComponentPropsWithoutRef<"a"> & { children?: ReactNode };
type CodeProps = ComponentPropsWithoutRef<"code"> & {
  children?: ReactNode;
  className?: string;
};

export function MarkdownMessage({ content }: MarkdownMessageProps): JSX.Element {
  return (
    <div className="qna-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          a: ({ children, ...props }: AnchorProps) => (
            <a
              {...props}
              className="text-indigo-300 underline underline-offset-4 hover:text-indigo-200"
              target="_blank"
              rel="noreferrer"
            >
              {children}
            </a>
          ),
          code: ({ children, className, ...props }: CodeProps) => {
            const isBlock = Boolean(className);

            if (isBlock) {
              return (
                <code
                  {...props}
                  className={className}
                >
                  {children}
                </code>
              );
            }

            return (
              <code
                {...props}
                className="text-zinc-100"
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
