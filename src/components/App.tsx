import { ThemeProvider } from "./theme-provider";
import { AppHeader } from "./AppHeader";
import { AppMain } from "./AppMain";
import { ModelProvider, PageProvider, ChatProvider } from "@/lib/context";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="llmchata-ui-theme">
      <PageProvider>
        <ModelProvider>
          <ChatProvider>
            <AppHeader />
            <AppMain />
          </ChatProvider>
        </ModelProvider>
      </PageProvider>
    </ThemeProvider>
  );
}

export default App;
