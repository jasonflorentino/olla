import { Text } from "@/components/ui";
import {
  ModelSelect,
  ModelThinkSelect,
  Seed,
  SummaryToggle,
  SystemPromptSelector,
} from "@/components/settings";

export function SettingsPage() {
  return (
    <>
      <Text.H2>Settings</Text.H2>

      <section className="mt-7">
        <Text.H3>Chat</Text.H3>
        <Text.Muted>Settings for the chat</Text.Muted>

        <SummaryToggle />
      </section>

      <section className="mt-7">
        <Text.H3>Model</Text.H3>
        <Text.Muted>
          Which model to use, and whether to use Thinking before responding.
        </Text.Muted>
        <div className="flex gap-4 mt-4">
          <ModelSelect />
          <ModelThinkSelect />
        </div>
      </section>

      <section className="mt-7">
        <Text.H3>System Prompt</Text.H3>
        <Text.Muted>
          A guiding instruction that gets inserted before your first message.
          This shapes behavior, tone, and constraints of the model's responses.
        </Text.Muted>

        <SystemPromptSelector />
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
