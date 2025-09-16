import { useEffect, useState, useRef, useCallback } from "react";

import { useModelContext } from "@/lib/model-context";
import { Button } from "./ui/button";
import { type Message, type ChatCompletionChunk } from "@/lib/types";
import { useChatContext } from "@/lib/chat-context";
import { API, Util } from "@/lib";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChatSubmit() {
  const { message, setMessage, messages, setMessages, updateResponse } =
    useChatContext();
  const { model, think, prompt, seed, seedEnabled } = useModelContext();
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef<AbortController>(null);

  const disabled = !message && !loading;

  const handleClick = useCallback(() => {
    setLoading(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: message, key: Date.now() + Util.djb2(message) },
    ];

    setMessages(newMessages);
    setMessage("");

    API.generateChatCompletion({
      model,
      think,
      controller,
      seed: seedEnabled ? seed : null,
      systemPrompt: prompt,
      messages: newMessages,
      onContent: (c: ChatCompletionChunk) => {
        if (c.done) {
          setLoading(false);
          abortControllerRef.current = null;
        }
        updateResponse(c);
      },
      onError: () => {
        setLoading(false);
        abortControllerRef.current = null;
      },
    });
  }, [
    message,
    messages,
    model,
    seed,
    seedEnabled,
    prompt,
    setMessage,
    setMessages,
    think,
    updateResponse,
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) {
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleClick();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClick, disabled]);

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <Button
      className={cn(disabled && "cursor-not-allowed", "block")}
      size="default"
      disabled={disabled}
      onClick={loading ? handleStop : handleClick}
    >
      <div className="flex justify-center items-center gap-1">
        {loading ? <LoaderCircle className="animate-spin" /> : "Submit"}
        {loading ? "Stop" : ""}
      </div>
    </Button>
  );
}
