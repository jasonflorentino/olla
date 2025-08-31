import { ChatInput } from "./ChatInput";
import { ChatSubmit } from "./ChatSubmit";
import { ChatHistory } from "./ChatHistory";
import { ChatClear } from "./ChatClear";
import { usePageContext } from "@/lib/page-context";
import { Page } from "@/lib/types";
import { SettingsPage } from "./SettingsPage";

export function AppMain() {
  const { page } = usePageContext();

  const isHome = page === Page.Home;
  const isSettings = page === Page.Settings;

  return (
    <main className="px-6 py-4">
      {isHome && (
        <>
          <ChatHistory />
          <div className="lg:max-w-[800px] lg:mx-auto">
            <ChatInput>
              <div className="flex gap-3 justify-end absolute bottom-4 right-4">
                <ChatClear />
                <ChatSubmit />
              </div>
            </ChatInput>
          </div>
        </>
      )}

      {isSettings && (
        <div className="lg:max-w-[800px] lg:mx-auto">
          <SettingsPage />
        </div>
      )}
    </main>
  );
}
