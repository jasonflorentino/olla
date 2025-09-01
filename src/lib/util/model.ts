export function toModelDisplayName(name: unknown): string {
  return typeof name === "string" ? name.split(":")[0] : "";
}
