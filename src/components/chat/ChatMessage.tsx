import { marked } from "marked";
import React, { useEffect, useRef } from "react";

import { cn } from "@/lib/util";
import { Role, type Message } from "@/lib/types";
import { Util } from "@/lib";
import { CopyButton } from "@/components/CopyButton";
import { SelectAllButton } from "@/components/SelectAllButton";

export const ChatMessage = ({ message }: { message: Message }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  if (!message) {
    return null;
  }

  // Clipboard API is only available in secure contexts.
  // Provide a "select all" helper if we can't programatically copy.
  const useSelectAll = "http:" === location.protocol;

  const isUser = message.role === Role.User;
  const isAssistant = message.role === Role.Assistant;

  const widthClass = isUser ? "w-10/12 sm:w-8/12 md:w-7/12 ml-auto" : "";
  return (
    <div className="mb-6">
      <div
        className={cn(
          "py-2 rounded-lg",
          widthClass,
          isUser ? "px-3 bg-secondary border" : "bg-background",
        )}
      >
        <h4
          className={cn("text-base", isUser ? "text-chart-3" : "text-chart-2")}
        >
          {isUser
            ? "you"
            : Util.toModelDisplayName(message.meta?.model) || "model"}
        </h4>

        <Thinking message={message} />
        <Content ref={contentRef} message={message} />
      </div>
      <div className={cn(widthClass, "py-1")}>
        {!useSelectAll && <CopyButton content={message.content} />}
        {useSelectAll && <SelectAllButton contentRef={contentRef} />}
      </div>
      {isAssistant && <Meta message={message} />}
    </div>
  );
};

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

const Content = React.forwardRef<HTMLDivElement, { message: Message }>(
  ({ message }, contentRef) => {
    useEffect(() => {
      if (
        message.role === Role.User ||
        !contentRef ||
        typeof contentRef === "function"
      ) {
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
    }, [contentRef, message.content, message.role, message.meta]);

    return (
      <div
        ref={contentRef}
        className={cn("Content", "leading-7 text-card-foreground")}
      >
        {message.content}
      </div>
    );
  },
);

const Thinking = ({ message }) => {
  if (!message.thinking) {
    return null;
  }
  return (
    <div className={cn("mb-2 opacity-75")}>
      <h5
        className={cn(
          "text-xs font-medium tracking-wide text-muted-foreground",
        )}
      >
        Thinking...
      </h5>
      <div className={cn("Content", "text-xs text-muted-foreground")}>
        {message.thinking}
      </div>
    </div>
  );
};
