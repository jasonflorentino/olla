import { ThemeToggle } from "./ThemeToggle";
import { SettingsButton } from "./SettingsButton";

export function AppHeader() {
  return (
    <header className="flex flex-col md:flex-row justify-between items-center px-6 py-4">
      <h1 className="scroll-m-20 md:border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0">
        🐱Olla
      </h1>
      <div className="flex gap-1 sm:gap-2 md:gap-3 mt-2">
        <ThemeToggle />
        <SettingsButton />
      </div>
    </header>
  );
}
