import { cn } from "@/lib/util";
import { Text } from "@/components/ui";
import {
  ModelSelect,
  ModelThinkSelect,
  Seed,
  SummaryToggle,
  SystemPromptSelector,
} from "@/components/settings";
import { useModelContext } from "@/lib/context";

export function SettingsPage() {
  const { think, canThink } = useModelContext();
  return (
    <>
      <Text.H2>Settings</Text.H2>

      <section className="mt-7">
        <Text.H3>System Prompt</Text.H3>
        <Text.Muted>
          A guiding instruction that gets inserted before your first message.
          This shapes behavior, tone, and constraints of the model's responses.
        </Text.Muted>

        <SystemPromptSelector />
      </section>

      <section className="mt-7">
        <Text.H3>Model</Text.H3>
        <Text.Muted className="mb-4">
          Which model to use. Smaller models are fast but shallow or brittle.
          Larger models are flexible and capable but slow. Small models often
          give good-enough answers quickly. Large models are more likely to give
          an answer that is thought through and better adapted to the situation.
        </Text.Muted>
        <ModelSelect />
      </section>

      <section className="mt-7">
        <div className="flex justify-between items-center">
          <span className="flex gap-2 items-baseline">
            <Text.H3 className={cn(!think && "opacity-50")}>Thinking</Text.H3>
            {!canThink && (
              <Text.Muted className={cn(!think && "opacity-50")}>
                (The selected model doesn't support thinking)
              </Text.Muted>
            )}
          </span>
          <ModelThinkSelect />
        </div>
        <Text.Muted className={cn(!think && "opacity-70", "my-2")}>
          The model does more internal back-and-forth before answering. This
          often helps with logic, math, planning, and nuanced questions, but can
          take longer. For quick or simple tasks, leaving it off is usually
          fine.{" "}
        </Text.Muted>
      </section>

      <section className="mt-7">
        <SummaryToggle />
      </section>

      <section className="mt-7">
        <Text.H3>Model Parameters</Text.H3>
        <Text.Muted>
          Parameters that can be set when the model is run.
        </Text.Muted>

        <Seed />
      </section>
    </>
  );
}
