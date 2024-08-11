import React from "react";
import { cn } from "@/lib/utils";
import { useBluePrint } from "@/hooks/use-blueprint";

import { AgentWorkInfo } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardData } from "@/components/reusable/card-data";

import { USDollar } from "@/formulas/numbers";
import { daysOfTheWeek } from "@/formulas/schedule";
import { formatDate, formatJustTime } from "@/formulas/dates";

//TODO see if we can merge the UI from this and the dahboadc lient and the yearly blueprint
type Props = {
  info: AgentWorkInfo;
  size?: string;
};

export const AgentWorkInfoCard = ({ info, size = "md" }: Props) => {
  const { onWorkInfoFormOpen } = useBluePrint();
  const hours = info.workingHours.split("-");

  return (
    <div
      className={cn("w-full h-full space-y-2", size == "sm" ? "text-sm" : "")}
    >
      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold">Work info</p>

        <Button onClick={() => onWorkInfoFormOpen(info)}>Edit Details</Button>
      </div>

      <CardData label="Type" value={info.workType} />
      <div className="flex flex-wrap gap-2">
        {daysOfTheWeek.map((day) => (
          <Badge
            key={day}
            variant={
              info.workingDays.includes(day) ? "default" : "outlineprimary"
            }
          >
            {day}
          </Badge>
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
        value={USDollar.format(info.annualTarget)}
      />
      <CardData label="Created At" value={formatDate(info.createdAt)} />

      {info.createdAt != info.updatedAt && (
        <CardData label="Updated At" value={formatDate(info.updatedAt)} />
      )}
    </div>
  );
};
