import { ThemeProvider } from "./theme-provider";
import { AppHeader } from "./AppHeader";
import { AppMain } from "./AppMain";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="llmchata-ui-theme">
      <AppHeader />
      <AppMain />
    </ThemeProvider>
  );
}

export default App;
