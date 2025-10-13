import { cn } from "@/lib/util";
import { Text, Switch } from "@/components//ui";
import { useChatContext } from "@/lib/context";

export function SummaryToggle() {
  const { summaryEnabled, setSummaryEnabled } = useChatContext();

  return (
    <div className="mt-5">
      <div className="flex justify-between items-center">
        <Text.H3 className={cn(!summaryEnabled && "opacity-50")}>
          Chat Compression
        </Text.H3>
        <Switch
          id="toggle-seed"
          checked={summaryEnabled}
          onCheckedChange={setSummaryEnabled}
        />
      </div>

      <Text.Muted className={cn(!summaryEnabled && "opacity-70", "my-2")}>
        Instead of sending the full chat history in the context with each new
        message, include a summary of the chat up to this point. Decreases
        memory clarity but increases parsing and generation speed.
      </Text.Muted>
    </div>
  );
}
