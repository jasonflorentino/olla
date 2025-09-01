import * as React from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * PeekCollapsible
 * - Uses Radix Collapsible for a11y and state
 * - Shows the first N lines when collapsed (a "peek") with a subtle bottom fade
 * - Expands to reveal full content
 *
 * Requirements:
 * - Tailwind (shadcn/ui default)
 * - lucide-react (icons)
 * - @radix-ui/react-collapsible
 */
export default function PeekCollapsible({
  title,
  children,
  checked = false,
  defaultOpen = false,
  peekLines = 3,
  className = "",
}: {
  title: React.ReactNode;
  checked: boolean;
  children: React.ReactNode;
  defaultOpen?: boolean;
  peekLines?: number;
  className?: string;
}) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={setOpen}
      className={`w-full group ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        {title}

        <Collapsible.Trigger asChild>
          <Button variant="ghost" size="sm" className="shrink-0">
            {open ? (
              <>
                <ChevronUp className="mr-1 h-4 w-4" />
                <span className="sr-only">Collapse</span>
              </>
            ) : (
              <>
                <ChevronDown className="mr-1 h-4 w-4" />
                <span className="sr-only">Expand</span>
              </>
            )}
          </Button>
        </Collapsible.Trigger>
      </div>

      <div
        className="relative text-sm leading-relaxed"
        style={{
          // Max height when collapsed = N * line-height (1.625em for leading-relaxed)
          // We keep it generous for mixed content.
          // @ts-expect-error - CSS variable for calc()
          "--peek-lines": peekLines,
          maxHeight: open ? undefined : "calc(var(--peek-lines) * 1.625em)",
          overflow: open ? undefined : "hidden",
        }}
      >
        <Collapsible.Content forceMount>
          <div className="[&>*+*]:mt-3">{children}</div>
        </Collapsible.Content>

        {!open && (
          <div
            className={cn(
              "pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent",
              checked
                ? "to-blue-50 dark:to-blue-950"
                : "to-background group-hover:to-accent/50",
            )}
          />
        )}
      </div>
    </Collapsible.Root>
  );
}
