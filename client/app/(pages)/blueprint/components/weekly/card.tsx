import React from "react";
import { useCurrentRole } from "@/hooks/user-current-role";
import {
  useBluePrintStore,
  useBluePrintActions,
  useBluePrintData,
} from "@/hooks/use-blueprint";

import { Bar } from "../card-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyCard } from "@/components/reusable/empty-card";
import SkeletonWrapper from "@/components/skeleton-wrapper";

import { formatDate } from "@/formulas/dates";
import { ALLADMINS } from "@/constants/user";

//TODO see if we can merge the UI from this and the dashboad client and the yearly blueprint
type BarType = {
  label: string;
  data: number;
  target: number;
  percentage: number;
  dollar: boolean;
};
export const BluePrintWeeklyCard = () => {
  const role = useCurrentRole();
  const { onBluePrintWeekFormOpen } = useBluePrintStore();
  const { bluePrintWeekActive, isFetchingBluePrintWeekActive } =
    useBluePrintData();
  const { onCalculateBlueprintTargets } = useBluePrintActions();
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
  const callsPercentage = Math.ceil(calls / callsTarget);
  const appsPercentage = Math.ceil(appointments / appointmentsTarget);
  const premiumPercentage = Math.ceil(premium / premiumTarget);

  const barData: BarType[] = [
    {
      label: "Calls",
      data: calls,
      target: callsTarget,
      percentage: callsPercentage,
      dollar: false,
    },
    {
      label: "Appointments",
      data: appointments,
      target: appointmentsTarget,
      percentage: appsPercentage,
      dollar: false,
    },
    {
      label: "Premium",
      data: premium,
      target: premiumTarget,
      percentage: premiumPercentage,
      dollar: true,
    },
  ];
  return (
    <SkeletonWrapper isLoading={isFetchingBluePrintWeekActive}>
      <div>
        <div className="flex justify-between items-center mb-2">
          <p className="font-semibold">Weekly Goals</p>
          <Badge>
            {formatDate(createdAt, "MM/dd")} - {formatDate(endAt, "MM/dd")}
          </Badge>
        </div>

        {barData.map((data) => (
          <Bar key={data.label} {...data} />
        ))}

        {/*TODO - dont forget to remove this grid as its for testing purposes
        only */}

        {ALLADMINS.includes(role!) && (
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
