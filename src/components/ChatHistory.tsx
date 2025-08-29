import { useChatContext } from "@/lib/chat-context";
import { cn } from "@/lib/utils";

export function ChatHistory() {
  const { messages } = useChatContext();

  return (
    <section className="lg:max-w-3/4 mx-auto w-full">
      {messages.map((m) => {
        const isUser = m.role === "user";

        return (
          <div
            key={m.key}
            className={cn(
              "mb-4 w-7/12 py-2 px-3 border rounded-lg",
              isUser ? "ml-auto bg-stone-900" : "bg-gray-900",
            )}
          >
            <p
              className={cn(
                "text-base",
                isUser ? "text-yellow-300" : "text-green-400",
              )}
            >
              {isUser ? "you" : "model"}
            </p>

            <p className={cn("text-lg text-gray-200")}>{m.content}</p>
          </div>
        );
      })}
    </section>
  );
}
