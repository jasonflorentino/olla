import { useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useChatContext } from "@/lib/chat-context";
import { generateChatCompletion } from "@/lib/api";
import { useModelContext } from "@/lib/model-context";

let notFetched = true;

export function ChatInput() {
  const { message, setMessage } = useChatContext();
  const { model } = useModelContext();

  useEffect(() => {
    if (model && notFetched) {
      notFetched = false;
      generateChatCompletion({
        model,
        messages: [{ role: "user", content: "why is the sky blue? be brief!" }],
        onContent: (c: string) => console.log(c),
      });
    }
  }, [model]);

  return (
    <div>
      <Textarea
        placeholder="Type your message here."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
    </div>
  );
}
