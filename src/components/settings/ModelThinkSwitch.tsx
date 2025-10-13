import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useModelContext } from "@/lib/context";

export function ModelThinkSelect() {
  const { think, setThink, canThink } = useModelContext();

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="model-think"
        checked={think}
        onCheckedChange={setThink}
        disabled={!canThink}
      />
      <Label htmlFor="model-think">Think</Label>
    </div>
  );
}
