import { ChatProvider } from "@/lib/chat-context";
import { ChatInput } from "./ChatInput";

export function AppMain() {
  return (
    <main className="px-6 py-4">
      <ChatProvider>
        <ChatInput />
      </ChatProvider>
    </main>
  );
}
