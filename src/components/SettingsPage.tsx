import { useState } from "react";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "./ui/label";
import { Text, Switch } from "./ui";
import { ModelSelect } from "./ModelSelect";
import { ModelThinkSelect } from "./ModelThinkSwitch";
import { useModelContext } from "@/lib/model-context";
import PeekCollapsible from "./PeekCollapsable";
import { Input } from "./ui/input";

export function SettingsPage() {
  const { prompt, prompts, setPrompt } = useModelContext();

  const [seedEnabled, setSeedEnabled] = useState(false);

  return (
    <>
      <Text.H2>Settings</Text.H2>

      <section className="mt-7">
        <Text.H3>Model</Text.H3>
        <Text.Muted>
          Which model to use, and whether to use Thinking before responding.
        </Text.Muted>
        <div className="flex gap-4 mt-4">
          <ModelSelect />
          <ModelThinkSelect />
        </div>
      </section>

      <section className="mt-7">
        <Text.H3>System Prompt</Text.H3>
        <Text.Muted>
          A guiding instruction that gets inserted before your first message.
          This shapes behavior, tone, and constraints of the model's responses.
        </Text.Muted>

        <RadioGroup
          className="mt-4"
          defaultValue={prompt}
          onValueChange={setPrompt}
        >
          {Object.entries(prompts).map(([name, text]) => {
            return (
              <Label
                key={name}
                className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950"
              >
                <RadioGroupItem value={text} id={name} />
                <PeekCollapsible
                  peekLines={3}
                  title={
                    <p className="text-base leading-none font-medium">{name}</p>
                  }
                  checked={prompt === text}
                >
                  <div className="grid gap-1.5 font-normal">
                    <p className="text-muted-foreground text-sm">{text}</p>
                  </div>
                </PeekCollapsible>
              </Label>
            );
          })}
        </RadioGroup>
      </section>

      <section className="mt-7">
        <Text.H3>Model Parameters</Text.H3>
        <Text.Muted>
          Parameters that can be set when the model is run.
        </Text.Muted>

        <div className="mt-5">
          <div className="flex justify-between items-center">
            <Text.H4 className={cn(!seedEnabled && "opacity-50")}>Seed</Text.H4>
            <Switch
              id="toggle-seed"
              checked={seedEnabled}
              onCheckedChange={setSeedEnabled}
            />
          </div>

          <Text.Muted className={cn(!seedEnabled && "opacity-70", "my-2")}>
            Sets a number seed to use for generation. Setting this to a specific
            number will make the model generate the same text for the same
            prompt. Can be any integer between 1 and 4,294,967,295.
          </Text.Muted>

          <Input
            type="number"
            inputMode="numeric"
            min={0}
            max={0xffffffff}
            disabled={!seedEnabled}
            className={`font-mono mt-2`}
          />
        </div>
      </section>
    </>
  );
}
