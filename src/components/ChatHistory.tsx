import { marked } from "marked";
import { useEffect, useRef } from "react";
import { useChatContext } from "@/lib/chat-context";
import { cn } from "@/lib/utils";

export function ChatHistory() {
  const { messages } = useChatContext();

  return (
    <section className="lg:max-w-[800px] mx-auto w-full">
      {messages.map((m) => {
        const isUser = m.role === "user";

        return (
          <div
            key={m.key}
            className={cn(
              "mb-6 py-2 rounded-lg",
              isUser
                ? "w-10/12 sm:w-8/12 md:w-7/12 px-3 ml-auto bg-secondary border"
                : "bg-background",
            )}
          >
            <h4
              className={cn(
                "text-base",
                isUser ? "text-chart-3" : "text-chart-2",
              )}
            >
              {isUser ? "you" : "model"}
            </h4>

            <Content content={m.content} />
          </div>
        );
      })}
    </section>
  );
}

function Content({ content }: { content: string }) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const html = marked.parse(content);
      if (contentRef.current && typeof html === "string") {
        contentRef.current.innerHTML = html;
      }
    }, 500);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [content]);

  return (
    <div
      ref={contentRef}
      className={cn("Content", "leading-7 text-card-foreground")}
    >
      {content}
    </div>
  );
}
