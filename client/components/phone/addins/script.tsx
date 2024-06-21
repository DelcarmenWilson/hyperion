import React, { useMemo, useState } from "react";
import { useGlobalContext } from "@/providers/global";
import { usePhone } from "@/hooks/use-phone";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Tiptap } from "@/components/reusable/tiptap";
import { replaceScript } from "@/formulas/script";

export const PhoneScript = () => {
  const { lead, showScript, onScriptOpen, onScriptClose } = usePhone();

  const { script, user, licenses } = useGlobalContext();

  const formattedScript = useMemo(() => {
    return replaceScript(script?.script!, user?.firstName!, lead!, licenses!);
  }, [script, user, lead, licenses]);

  if (!script) {
    return null;
  }

  return (
    <>
      <div
        className={cn(
          "flex flex-col absolute justify-between items-center -bottom-full transition-[bottom] ease-in-out duration-100 left:0 w-full h-full overflow-hidden",
          showScript && "bottom-0"
        )}
      >
        <Tiptap description={formattedScript} onChange={() => {}} />
      </div>
      <Button
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        variant={showScript ? "default" : "outline"}
        onClick={() => {
          showScript ? onScriptClose() : onScriptOpen();
        }}
      >
        Basic Script
      </Button>
    </>
  );
};
