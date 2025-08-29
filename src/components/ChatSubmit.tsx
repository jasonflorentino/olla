import { useState } from "react";

import { useModelContext } from "@/lib/model-context";
import { Button } from "./ui/button";
import { type Message } from "@/lib/api";
import { useChatContext } from "@/lib/chat-context";
import { generateChatCompletion, type ChatCompletionChunk } from "@/lib/api";
import { djb2 } from "@/lib/utils/djb2";

export function ChatSubmit() {
  const { message, messages, setMessages, updateResponse } = useChatContext();
  const { model } = useModelContext();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: message, key: djb2(message) },
    ];

    setMessages(newMessages);

    generateChatCompletion({
      model,
      messages: newMessages,
      onContent: (c: ChatCompletionChunk) => {
        if (c.done) {
          setLoading(false);
        } else {
          updateResponse(c.message.content);
        }
      },
    });
  };

  return (
    <Button onClick={handleClick}>{loading ? "Loading..." : "Submit"}</Button>
  );
}
