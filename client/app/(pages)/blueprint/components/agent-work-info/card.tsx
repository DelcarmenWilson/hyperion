import React from "react";
import { cn } from "@/lib/utils";
import { useCurrentRole } from "@/hooks/user/use-current";
import { useBluePrintStore, useBluePrintData } from "@/hooks/use-blueprint";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardData } from "@/components/reusable/card-data";
import { EmptyCard } from "@/components/reusable/empty-card";
import SkeletonWrapper from "@/components/skeleton-wrapper";

import { USDollar } from "@/formulas/numbers";
import { formatJustTime } from "@/formulas/dates";
import { ALLADMINS } from "@/constants/user";

//TODO see if we can merge the UI from this and the dashboad client and the yearly blueprint
type Props = {
  size?: string;
  showButtons?: boolean;
};
export const AgentWorkInfoCard = ({
  size = "md",
  showButtons = false,
}: Props) => {
  const role = useCurrentRole();
  const { onWorkInfoFormOpen } = useBluePrintStore();
  const { onAgentWorkInfoGet } = useBluePrintData();
  const { agentWorkInfo, agentWorkInfoIsFetching } = onAgentWorkInfoGet();
  const hours = agentWorkInfo?.workingHours.split("-");

  return (
    <SkeletonWrapper isLoading={agentWorkInfoIsFetching}>
      {agentWorkInfo ? (
        <div
          className={cn(
            "w-full h-full space-y-2",
            size == "sm" ? "text-sm" : ""
          )}
        >
          <div className="flex justify-between items-center mb-2">
            <p className="font-semibold">Work info</p>
            {/* srinitodo - update to allusers if team wants to give BP edit option to all users */}
            {ALLADMINS.includes(role!) && showButtons && (
              <Button
                size="xs"
                onClick={() => onWorkInfoFormOpen(agentWorkInfo)}
              >
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
        </div>
      ) : (
        <EmptyCard title={"No Details"} />
      )}
    </SkeletonWrapper>
  );
};
