import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useModelContext } from "@/lib/model-context";
import PeekCollapsible from "../PeekCollapsable";

export function SystemPromptSelector() {
  const { prompt, prompts, setPrompt } = useModelContext();

  return (
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
  );
}
