import { Textarea } from "@/components/ui/textarea";
import { useChatContext } from "@/lib/chat-context";

export function ChatInput() {
  const { message, setMessage } = useChatContext();

  return (
    <div>
      <Textarea
        className="min-h-28"
        placeholder="Type your message here."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
    </div>
  );
}
