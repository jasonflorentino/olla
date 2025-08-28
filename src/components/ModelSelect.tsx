import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useModelContext } from "@/lib/model-context";
import { toModelDisplayName } from "@/lib/utils";

export function ModelSelect() {
  const { models, model, setModel } = useModelContext();

  const handleChange = (v: string) => {
    setModel(v);
  };

  return (
    <Select value={model} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Models</SelectLabel>
          {models.map((m) => (
            <SelectItem key={m.name} value={m.name}>
              {toModelDisplayName(m.name)} ({m.details.parameter_size})
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
