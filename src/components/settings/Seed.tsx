import { cn } from "@/lib/util";
import { Text, Switch } from "@/components/ui";
import { useModelContext } from "@/lib/model-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SEED_MAX = 0xffffffff;

export function Seed() {
  const { seed, setSeed, seedEnabled, setSeedEnabled } = useModelContext();

  const handleSeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    const num = Number(value);
    if (isNaN(Number(num))) {
      return;
    }
    if (num < 1 || num > SEED_MAX) {
      return;
    }
    setSeed(num);
  };

  const handleRandomClick = () => {
    const randNum = Math.floor(Math.random() * SEED_MAX);
    setSeed(randNum);
  };

  return (
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
        number will make the model generate the same text for the same prompt.
        Can be any integer between 1 and 4,294,967,295.
      </Text.Muted>

      <div className="mt-2 flex gap-4 items-center">
        <Input
          type="number"
          inputMode="numeric"
          min={0}
          max={SEED_MAX}
          value={seed}
          onChange={handleSeedChange}
          disabled={!seedEnabled}
          className={`font-mono `}
        />
        <Button disabled={!seedEnabled} onClick={handleRandomClick}>
          Random
        </Button>
      </div>
    </div>
  );
}
