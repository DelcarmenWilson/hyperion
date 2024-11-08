import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { usePhoneStore } from "@/hooks/use-phone";
import { useAgentLicenseData } from "@/app/(pages)/(main)/settings/(routes)/config/hooks/use-license";
import { useOnlineUserData } from "@/hooks/user/use-user";

import { Tiptap } from "@/components/reusable/tiptap";

import { replaceScript } from "@/formulas/script";

export const PhoneScript = () => {
  const { lead, script, showScript } = usePhoneStore();

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

  if (!script) return null;
  return (
    <>
      <div
        className={cn(
          "flex flex-col absolute justify-between items-center -bottom-full transition-[bottom] ease-in-out duration-100 left:0 w-full h-full overflow-hidden bg-background",
          showScript && "bottom-0"
        )}
      >
        <Tiptap
          key={lead?.id}
          description={formattedScript}
          onChange={() => {}}
        />
      </div>
    </>
  );
};
