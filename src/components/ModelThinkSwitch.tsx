import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { useModelContext } from "@/lib/model-context";

export function ModelThinkSelect() {
  const { think, setThink } = useModelContext();

  return (
    <div className="flex items-center space-x-2">
      <Switch id="model-think" checked={think} onCheckedChange={setThink} />
      <Label htmlFor="model-think">Think</Label>
    </div>
  );
}
