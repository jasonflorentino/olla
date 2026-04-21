import { Switch } from "@/components/ui/switch";
import { useModelContext } from "@/lib/context";

export function ModelThinkSelect() {
  const { think, setThink, canThink } = useModelContext();

  return (
    <Switch
      id="model-think"
      checked={think}
      onCheckedChange={setThink}
      disabled={!canThink}
    />
  );
}
