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
import { API, Util } from "@/lib";

export function ModelSelect() {
  const { models, model, setModel } = useModelContext();

  const handleChange = (v: string) => {
    if (model) {
      API.unloadModel({ model_name: model });
    }
    API.loadModel({ model_name: v });
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
              {Util.toModelDisplayName(m.name)} ({m.details.parameter_size})
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
