import React from "react";
import { cn } from "@/lib/utils";
import { useCurrentRole } from "@/hooks/user-current-role";
import { useBluePrint, useBluePrintActions } from "@/hooks/use-blueprint";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardData } from "@/components/reusable/card-data";
import { EmptyCard } from "@/components/reusable/empty-card";
import SkeletonWrapper from "@/components/skeleton-wrapper";

import { USDollar } from "@/formulas/numbers";
import { formatDate, formatJustTime } from "@/formulas/dates";

//TODO see if we can merge the UI from this and the dashboad client and the yearly blueprint

export const AgentWorkInfoCard = ({ size = "md" }: { size?: string }) => {
  const role = useCurrentRole();
  const { onWorkInfoFormOpen } = useBluePrint();
  const { agentWorkInfo, isFetchingAgentWorkInfo } = useBluePrintActions();
  const hours = agentWorkInfo?.workingHours.split("-");

  return (
    <SkeletonWrapper isLoading={isFetchingAgentWorkInfo}>
      {agentWorkInfo ? (
        <div
          className={cn(
            "w-full h-full space-y-2",
            size == "sm" ? "text-sm" : ""
          )}
        >
          <div className="flex justify-between items-center mb-2">
            <p className="font-semibold">Work info</p>

            {role == "ADMIN" && (
              <Button onClick={() => onWorkInfoFormOpen(agentWorkInfo)}>
                Edit Details
              </Button>
            )}
          </div>

          <CardData label="Type" value={agentWorkInfo.workType} />
          <div className="flex flex-wrap gap-2">
            {agentWorkInfo.workingDays.split(",").map((day) => (
              <Badge key={day}>{day}</Badge>
            ))}
          </div>

          <CardData
            label="Working Hours"
            value={`${formatJustTime(hours && hours[0])} - ${formatJustTime(
              hours && hours[1]
            )}`}
            column={size == "sm"}
          />

          <CardData
            label="Annual Target"
            value={USDollar.format(agentWorkInfo.annualTarget)}
          />
          <CardData
            label="Created At"
            value={formatDate(agentWorkInfo.createdAt)}
          />

          {agentWorkInfo.createdAt != agentWorkInfo.updatedAt && (
            <CardData
              label="Updated At"
              value={formatDate(agentWorkInfo.updatedAt)}
            />
          )}
        </div>
      ) : (
        <EmptyCard title={"No Details"} />
      )}
    </SkeletonWrapper>
  );
};
