import { ThemeToggle } from "./ThemeToggle";
import { SettingsButton } from "./SettingsButton";
import { Badge } from "@/components/ui";
import { useModelContext } from "@/lib/context";
import { CircleUser, Bot } from "lucide-react";

export function AppHeader() {
  const { prompt, prompts, model } = useModelContext();

  const promptName =
    Object.entries(prompts).find(([, p]) => p === prompt)?.[0] ?? "(none)";
  const modelName = model.split(":")?.[0] ?? "(none)";

  return (
    <header className="flex flex-col md:flex-row justify-between items-center px-6 py-4">
      <h1 className="scroll-m-20 md:border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0">
        🐱Olla
      </h1>
      <div className="flex gap-1 sm:gap-2 md:gap-3 mt-2">
        <Badge variant="secondary">
          <CircleUser />
          {promptName}
        </Badge>
        <Badge variant="outline">
          <Bot />
          {modelName}
        </Badge>
      </div>
      <div className="flex gap-1 sm:gap-2 md:gap-3 mt-2">
        <ThemeToggle />
        <SettingsButton />
      </div>
    </header>
  );
}
