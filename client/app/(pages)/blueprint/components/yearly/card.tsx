import React from "react";
import { useBluePrintData } from "@/hooks/use-blueprint";

import { Badge } from "@/components/ui/badge";
import { EmptyCard } from "@/components/reusable/empty-card";
import SkeletonWrapper from "@/components/skeleton-wrapper";

import { formatDate } from "@/formulas/dates";
import { Bar, CardData } from "../card-data";

type BarType = {
  label: string;
  data: number;
  target: number;
  percentage: number;
  dollar: boolean;
};

//TODO see if we can merge the UI from this and the dashboad client and the yearly blueprint
export const BluePrintYearlyCard = () => {
  const { bluePrintYearActive, isFetchingBluePrintYearActive } =
    useBluePrintData();

  if (!bluePrintYearActive) return <EmptyCard title={"No Details"} />;

  const {
    calls,
    callsTarget,
    appointments,
    appointmentsTarget,
    premium,
    premiumTarget,
    createdAt,
    weeks,
    endAt,
  } = bluePrintYearActive;
  const callsPercentage = Math.ceil(calls / (callsTarget * weeks));
  const appsPercentage = Math.ceil(appointments / (appointmentsTarget * weeks));
  const premiumPercentage = Math.ceil(premium / (premiumTarget * weeks));

  const barData: BarType[] = [
    {
      label: "Calls",
      data: calls,
      target: callsTarget * weeks,
      percentage: callsPercentage,
      dollar: false,
    },
    {
      label: "Appointments",
      data: appointments,
      target: appointmentsTarget * weeks,
      percentage: appsPercentage,
      dollar: false,
    },
    {
      label: "Premium",
      data: premium,
      target: premiumTarget * weeks,
      percentage: premiumPercentage,
      dollar: true,
    },
  ];
  return (
    <SkeletonWrapper isLoading={isFetchingBluePrintYearActive}>
      <div>
        <div className="flex justify-between items-center mb-2">
          <p className="font-semibold">Yearly Goals</p>
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
