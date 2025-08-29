import { useState } from "react";

import { useModelContext } from "@/lib/model-context";
import { Button } from "./ui/button";
import { type Message } from "@/lib/api";
import { useChatContext } from "@/lib/chat-context";
import { generateChatCompletion, type ChatCompletionChunk } from "@/lib/api";
import { djb2 } from "@/lib/utils/djb2";
import { LoaderCircle } from "lucide-react";

export function ChatSubmit() {
  const { message, setMessage, messages, setMessages, updateResponse } =
    useChatContext();
  const { model, think } = useModelContext();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: message, key: djb2(message) },
    ];

    setMessages(newMessages);
    setMessage("");

    generateChatCompletion({
      model,
      think,
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
    <Button
      className="my-3 w-full md:w-1/2 md:ml-auto block"
      size="lg"
      onClick={handleClick}
    >
      {loading ? <LoaderCircle className="mx-auto animate-spin" /> : "Submit"}
    </Button>
  );
}
