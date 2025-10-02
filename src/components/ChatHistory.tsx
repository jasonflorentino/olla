import { marked } from "marked";
import { useEffect, useRef } from "react";
import { useChatContext } from "@/lib/chat-context";
import { cn } from "@/lib/utils";
import { Role, type Message } from "@/lib/types";
import { API, Util } from "@/lib";
import { useModelContext } from "@/lib/model-context";

export function ChatHistory() {
  const { messages, setSummary } = useChatContext();
  const { model } = useModelContext();
  const abortControllerRef = useRef<AbortController>(null);

  // Handles generating a chat summary once messages have finished updating
  useEffect(() => {
    if (!messages.length) {
      return;
    }
    const generateSummary = async () => {
      const controller = new AbortController();
      abortControllerRef.current = controller;
      API.generateChatSummary({
        model,
        messages,
        controller,
        onContent: (c) => {
          setSummary(c.message.content);
          abortControllerRef.current = null;
        },
        onError: () => {
          abortControllerRef.current = null;
        },
      });
    };
    const timer = setTimeout(generateSummary, 2000);
    return () => {
      abortControllerRef.current = null;
      clearTimeout(timer);
    };
  }, [messages, model, setSummary]);

  return (
    <section className="lg:max-w-[800px] mx-auto w-full">
      {messages.map((m) => {
        const isUser = m.role === Role.User;
        const isAssistant = m.role === Role.Assistant;

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
              {isUser
                ? "you"
                : Util.toModelDisplayName(m.meta?.model) || "model"}
            </h4>

            <Content message={m} />
            {isAssistant && <Meta message={m} />}
          </div>
        );
      })}
    </section>
  );
}

function Meta({ message }: { message: Message }) {
  const meta = message.meta;
  if (!meta) {
    return null;
  }
  if (!meta.done) {
    return null;
  }

  const promptEvalCount = meta.prompt_eval_count;
  const promptEvalDuration = meta.prompt_eval_duration;
  const evalCount = meta.eval_count;
  const evalDuration = meta.eval_duration;

  return (
    <div className="flex flex-col md:flex-row justify-between mt-1 text-xs text-muted-foreground">
      <div className="flex items-end md:items-start flex-col">
        <p>
          {Util.getRelativeTime(new Date(meta.created_at))}
          {" – "}
          {new Date(meta.created_at).toISOString()}
        </p>
      </div>
      <div className="flex items-end flex-col ">
        <p>
          Evaluated {promptEvalCount} tokens (
          {Util.formatNanoseconds(promptEvalDuration)})
        </p>
        <p>
          Generated {evalCount} tokens ({Util.formatNanoseconds(evalDuration)})
        </p>
      </div>
    </div>
  );
}

function Content({ message }: { message: Message }) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (message.role === Role.User) {
      return;
    }
    const timer = setTimeout(() => {
      const html = marked.parse(message.content);
      if (contentRef.current && typeof html === "string") {
        contentRef.current.innerHTML = html;
      }
    }, 500);
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [message.content, message.role, message.meta]);

  return (
    <div
      ref={contentRef}
      className={cn("Content", "leading-7 text-card-foreground")}
    >
      {message.content}
    </div>
  );
}
