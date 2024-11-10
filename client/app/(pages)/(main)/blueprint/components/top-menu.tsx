"use client";
import { useCurrentRole } from "@/hooks/user/use-current";
import {
  useBluePrintActions,
  useBluePrintData,
  useBluePrintStore,
} from "@/hooks/use-blueprint";

import { Button } from "@/components/ui/button";
import { ALLADMINS } from "@/constants/user";

//   TODO - dont forget to remove this  as its for testing purposesonly

export const BluePrintTopMenu = () => {
  const role = useCurrentRole();
  const { onBluePrintWeekFormOpen } = useBluePrintStore();
  const { onBluePrintWeekActiveGet } = useBluePrintData();
  const { onCalculateBlueprintTargets } = useBluePrintActions();
  const { bluePrintWeekActive } = onBluePrintWeekActiveGet();

  if (!bluePrintWeekActive || !ALLADMINS.includes(role!)) return null;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-2">
      <Button
        size="sm"
        onClick={() => onBluePrintWeekFormOpen(bluePrintWeekActive)}
      >
        Edit Details
      </Button>
      <Button size="sm" onClick={onCalculateBlueprintTargets}>
        New Week
      </Button>
    </div>
  );
};
