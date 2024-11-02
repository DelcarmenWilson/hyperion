import React from "react";
import { useBluePrintData } from "@/hooks/use-blueprint";

import { Bar } from "../card-data";
import { Badge } from "@/components/ui/badge";
import { EmptyCard } from "@/components/reusable/empty-card";
import SkeletonWrapper from "@/components/skeleton-wrapper";

import { formatDate } from "@/formulas/dates";

//TODO see if we can merge the UI from this and the dashboad client and the yearly blueprint
type BarType = {
  label: string;
  data: number;
  target: number;
  percentage: number;
  dollar: boolean;
};

export const BluePrintWeeklyCard = () => {
  const { onBluePrintWeekActiveGet } = useBluePrintData();
  const { bluePrintWeekActive, bluePrintWeekActiveIsFetching } =
    onBluePrintWeekActiveGet();
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
    <SkeletonWrapper isLoading={bluePrintWeekActiveIsFetching}>
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
      </div>
    </SkeletonWrapper>
  );
};
