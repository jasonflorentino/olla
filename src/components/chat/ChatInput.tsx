import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { useChatContext } from "@/lib/context";

export function ChatInput({ children }: { children: React.ReactNode }) {
  const { message, setMessage } = useChatContext();

  return (
    <div className="relative">
      <Textarea
        className="min-h-32"
        placeholder="Type your message here."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      {children}
    </div>
  );
}
