import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "./ui/label";
import { Text } from "./ui";
import { ModelSelect } from "./ModelSelect";
import { ModelThinkSelect } from "./ModelThinkSwitch";
import { useModelContext } from "@/lib/model-context";
import PeekCollapsible from "./PeekCollapsable";

export function SettingsPage() {
  const { prompt, prompts, setPrompt } = useModelContext();

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
    </>
  );
}
