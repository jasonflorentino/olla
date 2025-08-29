import { useChatContext } from "@/lib/chat-context";

export function ChatHistory() {
  const { messages } = useChatContext();

  return (
    <section>
      {messages.map((m) => (
        <div key={m.key}>
          <p>{m.role}</p>
          <p>{m.content}</p>
        </div>
      ))}
    </section>
  );
}
