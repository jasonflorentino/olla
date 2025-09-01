import type { Model } from "../types";

export function toModelDisplayName(name: unknown): string {
  return typeof name === "string" ? name.split(":")[0] : "";
}

export function sortModels(models: Model[]): Model[] {
  return [...models].sort((a, b) => {
    return (
      // smallest param size first
      paramSizeToNum(a.details.parameter_size) -
      paramSizeToNum(b.details.parameter_size)
    );
  });
}

// eg. "3.2B" -> 3.2
function paramSizeToNum(p: string): number {
  return Number(p.replace(/[^\d.]/g, ""));
}
