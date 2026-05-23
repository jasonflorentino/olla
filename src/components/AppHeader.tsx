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
  Thermometer,
} from "lucide-react";

export function AppHeader() {
  const {
    prompt,
    prompts,
    model,
    seed,
    seedEnabled,
    think,
    temperatureEnabled,
    temperature,
  } = useModelContext();
  const { summaryEnabled } = useChatContext();

  const promptName =
    Object.entries(prompts).find(([, p]) => p === prompt)?.[0] ?? "(none)";
  const modelName = model.split(":")?.[0] ?? "(none)";

  return (
    <header className="flex flex-col md:flex-row justify-between items-center gap-2 px-6 py-4">
      <h1 className="scroll-m-20 md:border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0">
        🐱Olla
      </h1>
      <div className="flex flex-wrap justify-center gap-1 sm:gap-2 md:gap-3 mt-2 cursor-default">
        <Badge variant="secondary" title="system prompt">
          <CircleUser />
          {promptName}
        </Badge>
        <Badge variant="secondary" title="chat compression">
          {summaryEnabled ? <NotepadText /> : <ScrollText />}
          {summaryEnabled ? "Compress Chat" : "Raw Chat"}
        </Badge>
        <Badge variant="outline" title="model name">
          <Bot />
          {modelName}
        </Badge>
        {think && (
          <Badge variant="outline" title="thinking">
            <Brain />
            Thinking
          </Badge>
        )}
        {seedEnabled && (
          <Badge variant="outline" title="seed">
            <Bean />
            {seed}
          </Badge>
        )}
        {temperatureEnabled && (
          <Badge variant="outline" title="temperature">
            <Thermometer />
            {temperature}
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
