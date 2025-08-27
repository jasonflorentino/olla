import { ModeToggle } from "./mode-toggle";

export function AppHeader() {
  return (
    <header className="flex justify-between items-center px-6 py-4">
      <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        🐱 Chat
      </h1>
      <ModeToggle />
    </header>
  );
}
