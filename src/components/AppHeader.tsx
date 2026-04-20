import { ThemeToggle } from "./ThemeToggle";
import { SettingsButton } from "./SettingsButton";
import { Badge } from "@/components/ui";
import { useChatContext, useModelContext } from "@/lib/context";
import {
  Bean,
  Bot,
  Brain,
  CircleUser,
  NotepadText,
  ScrollText,
} from "lucide-react";

export function AppHeader() {
  const { prompt, prompts, model, seed, seedEnabled, think } =
    useModelContext();
  const { summaryEnabled } = useChatContext();

  const promptName =
    Object.entries(prompts).find(([, p]) => p === prompt)?.[0] ?? "(none)";
  const modelName = model.split(":")?.[0] ?? "(none)";

  return (
    <header className="flex flex-col md:flex-row justify-between items-center gap-2 px-6 py-4">
      <h1 className="scroll-m-20 md:border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0">
        🐱Olla
      </h1>
      <div className="flex flex-wrap justify-center gap-1 sm:gap-2 md:gap-3 mt-2">
        <Badge variant="secondary">
          <CircleUser />
          {promptName}
        </Badge>
        <Badge variant="secondary">
          {summaryEnabled ? <NotepadText /> : <ScrollText />}
          {summaryEnabled ? "Compress Chat" : "Raw Chat"}
        </Badge>
        <Badge variant="outline">
          <Bot />
          {modelName}
        </Badge>
        {think && (
          <Badge variant="outline">
            <Brain />
            Thinking
          </Badge>
        )}
        {seedEnabled && (
          <Badge variant="outline">
            <Bean />
            {seed}
          </Badge>
        )}
      </div>

      <div className="flex gap-1 sm:gap-2 md:gap-3 mt-2">
        <ThemeToggle />
        <SettingsButton />
      </div>
    </header>
  );
}
