import React from "react";
import { FullTimeInfo } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { CardData } from "@/components/reusable/card-data";
import { USDollar } from "@/formulas/numbers";
import { daysOfTheWeek } from "@/formulas/schedule";
import { formatDate, formatJustTime } from "@/formulas/dates";
import { cn } from "@/lib/utils";

type Props = {
  info: FullTimeInfo;
  size?: string;
};

export const DetailsCard = ({ info, size = "md" }: Props) => {
  const hours = info.workingHours.split("-");
  return (
    <div
      className={cn("w-full h-full space-y-2", size == "sm" ? "text-sm" : "")}
    >
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
