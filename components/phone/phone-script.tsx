import React, { useCallback, useEffect, useMemo, useState } from "react";
import CKeditor from "@/components/reusable/ckeditor";

import { ScrollArea } from "@/components/ui/scroll-area";
import { usePhoneModal } from "@/hooks/use-phone-modal";
import { useGlobalContext } from "@/providers/global-provider";
import { replaceScript } from "@/formulas/script";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export const PhoneScript = () => {
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { lead } = usePhoneModal();

  const { script, user, licenses } = useGlobalContext();

  const formattedScript = useMemo(() => {
    return replaceScript(script?.script!, user?.firstName!, lead!, licenses!);
  }, [lead]);

  useEffect(() => {
    setEditorLoaded(true);
  }, [script]);

  if (!script) {
    return null;
  }

  return (
    <>
      <div
        className={cn(
          "flex flex-col absolute justify-between items-center -bottom-full transition-[bottom] ease-in-out duration-100 left:0 w-full h-full overflow-hidden",
          isOpen && "bottom-0"
        )}
      >
        <ScrollArea className="flex flex-col relative bg-background overflow-hidden pb-10">
          <CKeditor
            name="scripts"
            value={formattedScript}
            editorLoaded={editorLoaded}
          />
        </ScrollArea>
      </div>
      <Button
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        variant={isOpen ? "default" : "outline"}
        onClick={() => setIsOpen(!isOpen)}
      >
        Basic Script
      </Button>
    </>
  );
};
