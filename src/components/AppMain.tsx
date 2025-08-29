import { ChatProvider } from "@/lib/chat-context";
import { ChatInput } from "./ChatInput";
import { ChatSubmit } from "./ChatSubmit";
import { ChatHistory } from "./ChatHistory";

export function AppMain() {
  return (
    <main className="px-6 py-4">
      <ChatProvider>
        <ChatHistory />
        <div className="lg:max-w-3/4 lg:mx-auto">
          <ChatInput />
          <ChatSubmit />
        </div>
      </ChatProvider>
    </main>
  );
}
