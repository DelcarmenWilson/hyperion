import React from "react";
import { useCurrentRole } from "@/hooks/user-current-role";
import { useBluePrint, useBluePrintActions } from "@/hooks/use-blueprint";

import { Badge } from "@/components/ui/badge";
import { EmptyCard } from "@/components/reusable/empty-card";
import SkeletonWrapper from "@/components/skeleton-wrapper";

import { formatDate } from "@/formulas/dates";
import { CardData } from "../card-data";
import { Button } from "@/components/ui/button";

//TODO see if we can merge the UI from this and the dashboad client and the yearly blueprint

export const BluePrintWeeklyCard = () => {
  const role = useCurrentRole();
  const { onBluePrintWeekFormOpen } = useBluePrint();
  const {
    bluePrintWeekActive,
    isFetchingBluePrintWeekActive,
    onCalculateBlueprintTargets,
  } = useBluePrintActions();
  if (!bluePrintWeekActive) return <EmptyCard title={"No Details"} />;
  const {
    calls,
    callsTarget,
    appointments,
    appointmentsTarget,
    premium,
    premiumTarget,
    createdAt,
    endAt,
  } = bluePrintWeekActive;
  return (
    <SkeletonWrapper isLoading={isFetchingBluePrintWeekActive}>
      <div>
        <div className="flex justify-between items-center mb-2">
          <p className="font-semibold">Weekly Goals</p>
          <Badge>
            {formatDate(createdAt, "MM/dd")} - {formatDate(endAt, "MM/dd")}
          </Badge>
        </div>
        <CardData label="Calls" data={calls} target={callsTarget} />
        <CardData
          label="Appointments"
          data={appointments}
          target={appointmentsTarget}
        />
        <CardData
          label="Premium"
          data={premium}
          target={premiumTarget}
          dollar
        />
        {/*TODO - dont forget to remove this grid as its for testing purposes
        only */}

        {role == "ADMIN" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-2">
            <Button
              onClick={() => onBluePrintWeekFormOpen(bluePrintWeekActive)}
            >
              Edit Details
            </Button>
            <Button onClick={onCalculateBlueprintTargets}>New Week</Button>
          </div>
        )}
      </div>
    </SkeletonWrapper>
  );
};
