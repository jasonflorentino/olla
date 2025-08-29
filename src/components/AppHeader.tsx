import { ModeToggle } from "./mode-toggle";
import { ModelSelect } from "./ModelSelect";
import { ModelThinkSelect } from "./ModelThinkSwitch";

export function AppHeader() {
  return (
    <header className="flex justify-between items-center px-6 py-4">
      <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        🐱 Chat
      </h1>
      <div className="flex gap-4">
        <ModelThinkSelect />
        <ModelSelect />
        <ModeToggle />
      </div>
    </header>
  );
}
