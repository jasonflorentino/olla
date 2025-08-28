import { ThemeProvider } from "./theme-provider";
import { AppHeader } from "./AppHeader";
import { AppMain } from "./AppMain";
import { ModelProvider } from "@/lib/model-context";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="llmchata-ui-theme">
      <ModelProvider>
        <AppHeader />
        <AppMain />
      </ModelProvider>
    </ThemeProvider>
  );
}

export default App;
