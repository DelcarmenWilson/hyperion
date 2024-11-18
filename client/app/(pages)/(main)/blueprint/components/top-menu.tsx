"use client";
import { useCurrentRole } from "@/hooks/user/use-current";
import { useBluePrintActions, useBluePrintData } from "@/hooks/use-blueprint";

import { Button } from "@/components/ui/button";
import { ALLADMINS } from "@/constants/user";
import UpdateBluePrintWeekDialog from "./weekly/update-blueprint-week-dialog";

//   TODO - dont forget to remove this  as its for testing purposes only

const BluePrintTopMenu = () => {
  const role = useCurrentRole();
  const { onGetBluePrintWeekActive } = useBluePrintData();
  const { onCalculateBlueprintTargets } = useBluePrintActions(() => {});
  const { bluePrintWeekActive } = onGetBluePrintWeekActive();

  if (!bluePrintWeekActive || !ALLADMINS.includes(role!)) return null;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-2">
      <UpdateBluePrintWeekDialog bluePrintWeek={bluePrintWeekActive} />
      <Button size="sm" onClick={onCalculateBlueprintTargets}>
        New Week
      </Button>
    </div>
  );
};

export default BluePrintTopMenu;
