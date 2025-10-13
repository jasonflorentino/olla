import { ChatSubmit, ChatHistory, ChatInput, ChatClear } from "./chat";
import { usePageContext } from "@/lib/context";
import { Page } from "@/lib/types";
import { SettingsPage } from "./SettingsPage";

export function AppMain() {
  const { page } = usePageContext();

  const isHome = page === Page.Home;
  const isSettings = page === Page.Settings;

  return (
    <main className="px-4 sm:px-5 md:px-6 py-4">
      {isHome && (
        <>
          <ChatHistory />
          <div className="lg:max-w-[800px] lg:mx-auto">
            <ChatInput>
              <div className="flex gap-3 justify-end absolute bottom-3 right-3 sm:bottom-4 sm:right-4">
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
