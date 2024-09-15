"use client";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/use-current-user";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ThemeClient } from "@/components/custom/theme/client";

import { useSession } from "next-auth/react";
import { displaySettingsUpdate } from "@/actions/settings/display";

const DisplayPage = () => {
  const user = useCurrentUser();
  const { update } = useSession();

  const onSetDataStyle = async (style: string) => {
    const dataStyleUpdated = await displaySettingsUpdate(style);
    if (dataStyleUpdated.success) {
      update();
      toast.success(dataStyleUpdated.success);
    } else toast.error(dataStyleUpdated.error);
  };
  return (
    <>
      <ThemeClient />
      <div className="flex flex-col lg:flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
        <div className="space-y-0.5">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Data Table Style
          </label>
          <p className="text-[0.8rem] text-muted-foreground">
            Set Data Table Style
          </p>
        </div>
        <div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={"outline"}
              size="sm"
              onClick={() => onSetDataStyle("grid")}
              className={cn(
                user?.dataStyle === "grid" && "border-2 border-primary"
              )}
            >
              <LayoutGrid className="mr-1" />
              Grid
            </Button>
            <Button
              variant={"outline"}
              size="sm"
              onClick={() => onSetDataStyle("list")}
              className={cn(
                user?.dataStyle === "list" && "border-2 border-primary"
              )}
            >
              <List className="mr-1" />
              List
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DisplayPage;
