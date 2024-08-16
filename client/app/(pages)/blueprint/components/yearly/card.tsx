import React from "react";
import { useBluePrintActions } from "@/hooks/use-blueprint";

import { Badge } from "@/components/ui/badge";
import { EmptyCard } from "@/components/reusable/empty-card";
import SkeletonWrapper from "@/components/skeleton-wrapper";

import { formatDate } from "@/formulas/dates";
import { CardData } from "../card-data";

//TODO see if we can merge the UI from this and the dashboad client and the yearly blueprint
export const BluePrintYearlyCard = () => {
  const { bluePrintYearActive, isFetchingBluePrintYearActive } =
    useBluePrintActions();

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
  return (
    <SkeletonWrapper isLoading={isFetchingBluePrintYearActive}>
      <div>
        <div className="flex justify-between items-center mb-2">
          <p className="font-semibold">Yearly Goals</p>
          <Badge>
            {formatDate(createdAt, "MM/dd")} - {formatDate(endAt, "MM/dd")}
          </Badge>
        </div>

        <CardData label="Calls" data={calls} target={callsTarget * weeks} />
        <CardData
          label="Appointments"
          data={appointments}
          target={appointmentsTarget * weeks}
        />
        <CardData
          label="Premium"
          data={premium}
          target={premiumTarget * weeks}
          dollar
        />
      </div>
    </SkeletonWrapper>
  );
};
