"use client";

import { cn } from "@/lib/utils";
import { Activity } from "@prisma/client";
import { format } from "date-fns";

type CalendarBoxProps = {
  activity: Activity;
};

export const ActivityBox = ({ activity }: CalendarBoxProps) => {
  return (
    <div className="grid grid-cols-3 items-center gap-2 border-b py-2">
      <div>{activity.activity}</div>
      <div>{activity.newValue}</div>
      <div>{format(activity.createdAt, "MM-dd-yy hh:mm aa")}</div>
    </div>
  );
};
