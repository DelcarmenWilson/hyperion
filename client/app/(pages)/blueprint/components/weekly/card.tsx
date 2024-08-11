import React from "react";
import { BluePrintWeek } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/formulas/dates";
import CountUp from "react-countup";
//TODO see if we can merge the UI from this and the dahboadc lient and the yearly blueprint
type Props = {
  info: BluePrintWeek | null | undefined;
  size?: string;
};

export const BluePrintWeeklyCard = ({ info }: Props) => {
  if (!info) return null;
  const {
    calls,
    callsTarget,
    appointments,
    appointmentsTarget,
    premium,
    premiumTarget,
    startAt,
    endAt,
  } = info;
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold">Weekly Goals</p>
        <Badge>
          {formatDate(startAt, "MM/dd")} - {formatDate(endAt, "MM/dd")}
        </Badge>
      </div>

      <CardData2 label="Calls" data={calls} target={callsTarget} />
      <CardData2
        label="Appointments"
        data={appointments}
        target={appointmentsTarget}
      />
      <CardData2 label="Premium" data={premium} target={premiumTarget} dollar />
    </div>
  );
};

type CardDataProps = {
  label: string;
  data: number;
  target: number;
  dollar?: boolean;
};

export const CardData2 = ({ label, data, target, dollar }: CardDataProps) => {
  return (
    <div className="flex gap-2 flex-col">
      <p className="font-semibold">{label}</p>
      <p className="text-center text-2xl font-semibold">
        <span
          className={
            data == 0
              ? "text-destructive"
              : data > target
              ? "text-emerald-500"
              : "text-foreground"
          }
        >
          {dollar && "$"}
          <CountUp start={0} end={data} duration={3} />
        </span>
        {" / "}
        <span className="text-primary">
          {dollar && "$"}
          {target}
        </span>
      </p>
    </div>
  );
};
