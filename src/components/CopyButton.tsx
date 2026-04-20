import { useEffect, useState } from "react";
import { Check as IconCheck, Copy as IconCopy } from "lucide-react";

import { Button } from "@/components/ui";

export function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (copied) {
      timer = setTimeout(() => setCopied(false), 2000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [copied]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <Button
      variant={"ghost"}
      size="icon"
      onClick={() => handleCopy(content)}
      aria-label="Copy to clipboard"
      title="Copy to clipboard"
    >
      {copied ? <IconCheck /> : <IconCopy />}
    </Button>
  );
}
