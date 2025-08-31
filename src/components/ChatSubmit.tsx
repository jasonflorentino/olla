import { useState, useRef } from "react";

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
  const { model, think, prompt } = useModelContext();
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef<AbortController>(null);

  const handleClick = () => {
    setLoading(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const newMessages: Message[] = [
      ...messages,
      //TODO: handle keying messages that are exactly the same content.
      { role: "user", content: message, key: Util.djb2(message) },
    ];

    setMessages(newMessages);
    setMessage("");

    API.generateChatCompletion({
      model,
      think,
      controller,
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
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const disabled = !message && !loading;

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
