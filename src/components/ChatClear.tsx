import { useChatContext } from "@/lib/chat-context";
import { Button } from "./ui/button";
import { cn } from "@/lib/util";

export function ChatClear() {
  const { messages, setMessages } = useChatContext();
  const handleClick = () => {
    setMessages([]);
  };
  const disabled = messages.length === 0;
  return (
    <Button
      className={cn(disabled && "sr-only cursor-not-allowed", "block")}
      variant={"secondary"}
      size="default"
      disabled={disabled}
      onClick={handleClick}
    >
      {"New Chat"}
    </Button>
  );
}
