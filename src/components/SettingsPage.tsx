import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "./ui/label";
import { Text } from "./ui";
import { useModelContext } from "@/lib/model-context";

export function SettingsPage() {
  const { prompt, prompts, setPrompt } = useModelContext();

  return (
    <>
      <Text.H2>Settings</Text.H2>

      <section className="mt-4">
        <Text.H4>System Prompt</Text.H4>
        <Text.Muted>
          This text gets inserted before your first message.
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
                <div className="grid gap-1.5 font-normal">
                  <p className="text-sm leading-none font-medium">{name}</p>
                  <p className="text-muted-foreground text-sm">{text}</p>
                </div>
              </Label>
            );
          })}
        </RadioGroup>
      </section>
    </>
  );
}
