import { cn } from "@/lib/util";
import { Text, Switch } from "@/components/ui";
import { useModelContext, TEMPERATURE_DEFAULT } from "@/lib/context";
import { Button, Slider } from "@/components/ui";
import head from "lodash/head";

export function Temperature() {
  const {
    temperature,
    temperatureSet,
    temperatureEnabled,
    temperatureEnabledSet,
  } = useModelContext();

  const handleResetClick = () => {
    temperatureSet([TEMPERATURE_DEFAULT]);
  };

  return (
    <div className="mt-5">
      <div className="flex justify-between items-center">
        <Text.H4 className={cn(!temperatureEnabled && "opacity-50")}>
          Temperature
        </Text.H4>
        <Switch
          id="toggle-seed"
          checked={temperatureEnabled}
          onCheckedChange={temperatureEnabledSet}
        />
      </div>

      <Text.Muted className={cn(!temperatureEnabled && "opacity-70", "my-2")}>
        Controls how predictable or varied the model’s responses are. Lower
        values make responses more focused and repeatable. Higher values make
        responses more creative or surprising, but can also make them less
        consistent. (Default: {TEMPERATURE_DEFAULT})
      </Text.Muted>

      <div className="mt-2 flex gap-4 items-center">
        <Text.P className={cn(!temperatureEnabled && "opacity-50")}>
          {head(temperature)}
        </Text.P>
        <Slider
          id="slider-temperature"
          disabled={!temperatureEnabled}
          value={temperature}
          onValueChange={temperatureSet}
          min={1}
          max={100}
          step={1}
        />
        <Button
          disabled={
            !temperatureEnabled || head(temperature) === TEMPERATURE_DEFAULT
          }
          onClick={handleResetClick}
        >
          Default
        </Button>
      </div>
    </div>
  );
}
