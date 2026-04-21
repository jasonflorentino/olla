import { useEffect, useRef } from "react";

import { useChatContext } from "@/lib/context";
import { Role } from "@/lib/types";
import { API } from "@/lib";
import { useModelContext } from "@/lib/context";
import { ChatMessage } from "./ChatMessage";

export function ChatHistory() {
  const { messages, summary, setSummary } = useChatContext();
  const { model } = useModelContext();
  const abortControllerRef = useRef<AbortController>(null);
  const chatSummaryMessagesLastLength = useRef(messages.length);

  // Handles generating a chat summary once messages have finished updating
  useEffect(() => {
    const generateSummary = async () => {
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage) {
        return;
      }
      if (lastMessage.role === Role.User) {
        return;
      }
      const currLen = messages.length;
      const lastLen = chatSummaryMessagesLastLength.current;
      if (!currLen || currLen === lastLen) {
        return;
      } else {
        chatSummaryMessagesLastLength.current = currLen;
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;
      API.generateChatSummary({
        model,
        messages,
        controller,
        summary,
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
  }, [messages, model, summary, setSummary]);

  return (
    <section className="lg:max-w-[800px] mx-auto w-full">
      {messages.map((m) => (
        <ChatMessage key={m.key} message={m} />
      ))}
    </section>
  );
}
