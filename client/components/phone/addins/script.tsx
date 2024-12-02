import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { usePhoneStore } from "@/hooks/use-phone";
import { useAgentLicenseData } from "@/app/(pages)/(main)/settings/(routes)/config/hooks/use-license";
import { useOnlineUserData } from "@/hooks/user/use-user";

import { replaceScript } from "@/formulas/script";
import Renderer from "@/components/global/message/renderer";
import { ScrollArea } from "@/components/ui/scroll-area";

export const PhoneScript = () => {
  const { lead, script, showScript } = usePhoneStore();
  const [index, setIndex] = useState(0);

  const { onlineUser } = useOnlineUserData();
  const { onGetLicences } = useAgentLicenseData();
  const { licenses } = onGetLicences();

  const formattedScript = useMemo(() => {
    return replaceScript(
      script?.content!,
      onlineUser?.firstName!,
      lead!,
      licenses!
    );
  }, [script, onlineUser, lead, licenses]);

  useEffect(() => {
    if (!lead) return;
    setIndex((prev) => prev + 1);
  }, [lead]);

  if (!script) return null;
  return (
    <>
      <div
        className={cn(
          "flex flex-col absolute justify-between items-center -bottom-full transition-[bottom] ease-in-out duration-100 left:0 w-full h-full overflow-hidden bg-background",
          showScript && "bottom-0"
        )}
      >
        <ScrollArea className="pb-10 px-3">
          <Renderer key={index} value={formattedScript} />
        </ScrollArea>
      </div>
    </>
  );
};
