import { useChatContext } from "@/lib/context";
import { Button } from "@/components/ui";
import { cn } from "@/lib/util";

export function ChatClear() {
  const { messages, setMessages, setSummary } = useChatContext();
  const handleClick = () => {
    setMessages([]);
    setSummary("");
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
