import { useChatContext } from "@/lib/chat-context";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export function ChatClear() {
  const { messages, setMessages } = useChatContext();
  const handleClick = () => {
    setMessages([]);
  };
  const disabled = messages.length === 0;
  return (
    <Button
      className={cn(
        disabled && "cursor-not-allowed",
        "my-3 w-1/2 md:w-1/3 block",
      )}
      variant={"secondary"}
      size="lg"
      disabled={disabled}
      onClick={handleClick}
    >
      {"Clear Chat"}
    </Button>
  );
}
