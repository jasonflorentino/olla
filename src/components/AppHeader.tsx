import { ThemeToggle } from "./ThemeToggle";
import { ModelSelect } from "./ModelSelect";
import { ModelThinkSelect } from "./ModelThinkSwitch";
import { SettingsButton } from "./SettingsButton";

export function AppHeader() {
  return (
    <header className="flex flex-col md:flex-row justify-between items-center px-6 py-4">
      <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        🐱 Chat
      </h1>
      <div className="flex gap-3">
        <ModelThinkSelect />
        <ModelSelect />
        <ThemeToggle />
        <SettingsButton />
      </div>
    </header>
  );
}
