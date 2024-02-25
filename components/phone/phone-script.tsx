import { cn } from "@/lib/utils";
import { useState } from "react";
import { useGlobalContext } from "@/providers/global-provider";
import { usePhoneModal } from "@/hooks/use-phone-modal";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { replaceScript } from "@/formulas/script";

export const PhoneScript = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { lead } = usePhoneModal();

  const { script, user, licenses } = useGlobalContext();

  const formattedScript = replaceScript(
    script?.script!,
    user?.firstName!,
    lead!,
    licenses!
  );

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
          {formattedScript}
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
