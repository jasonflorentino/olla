import { Check as IconCheck, TextCursorInput } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export const SelectAllButton = ({
  contentRef,
}: {
  contentRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (clicked) {
      timer = setTimeout(() => setClicked(false), 2000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [clicked]);

  const handleButtonClick = () => {
    const selection = window.getSelection();

    if (!selection || !contentRef?.current) {
      return;
    }
    const range = document.createRange();
    range.selectNodeContents(contentRef.current);

    selection.removeAllRanges();
    selection.addRange(range);

    setClicked(true);
  };

  return (
    <Button
      variant={"ghost"}
      size="icon"
      onClick={handleButtonClick}
      aria-label="Select message"
      title="Select message"
    >
      {clicked ? <IconCheck /> : <TextCursorInput />}
    </Button>
  );
};
