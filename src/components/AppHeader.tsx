import { ThemeToggle } from "./ThemeToggle";
import { ModelSelect } from "./ModelSelect";
import { ModelThinkSelect } from "./ModelThinkSwitch";
import { SettingsButton } from "./SettingsButton";
import { usePageContext } from "@/lib/page-context";
import { Page } from "@/lib/types";

export function AppHeader() {
  const { page } = usePageContext();
  const isHome = page === Page.Home;

  return (
    <header className="flex flex-col md:flex-row justify-between items-center px-6 py-4">
      <h1 className="scroll-m-20 md:border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0">
        🐱Olla
      </h1>
      <div className="flex gap-1 sm:gap-2 md:gap-3 mt-2">
        {isHome && <ModelThinkSelect />}
        {isHome && <ModelSelect />}
        <ThemeToggle />
        <SettingsButton />
      </div>
    </header>
  );
}
