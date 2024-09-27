import React, { useMemo } from "react";
import { usePhoneStore } from "@/hooks/use-phone";
import { cn } from "@/lib/utils";

import { useAgentLicenseData } from "@/app/(pages)/settings/(routes)/config/hooks/use-license";
import { useScriptData } from "../hooks/use-script";
import { useOnlineUserData } from "@/hooks/user/use-user";

import { Button } from "@/components/ui/button";
import { Tiptap } from "@/components/reusable/tiptap";
import { replaceScript } from "@/formulas/script";

export const PhoneScript = () => {
  const { lead, showScript, onScriptOpen, onScriptClose } = usePhoneStore();

  const { script } = useScriptData();
  const { onlineUser } = useOnlineUserData();
  const { licenses } = useAgentLicenseData();

  const formattedScript = useMemo(() => {
    return replaceScript(
      script?.content!,
      onlineUser?.firstName!,
      lead!,
      licenses!
    );
  }, [script, onlineUser, lead, licenses]);

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
