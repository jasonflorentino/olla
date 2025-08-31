import { Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePageContext } from "@/lib/page-context";
import { Page } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SettingsButton() {
  const { page, setPage, prevPage } = usePageContext();

  const isSettingsPage = page === Page.Settings;

  const handleClick = () => {
    if (isSettingsPage) {
      setPage(prevPage);
    } else {
      setPage(Page.Settings);
    }
  };

  return (
    <Button
      variant={isSettingsPage ? "default" : "outline"}
      size="icon"
      onClick={handleClick}
    >
      <Settings
        className={cn(
          isSettingsPage ? "rotate-0" : "-rotate-90",
          "h-[1.2rem] w-[1.2rem] transition-all",
        )}
      />
      <span className="sr-only">Settings</span>
    </Button>
  );
}
