"use client";

import { format } from "date-fns";
import { Activity } from "@prisma/client";

type ActivityCardProps = {
  activity: Activity;
};

export const ActivityCard = ({ activity }: ActivityCardProps) => {
  return (
    <div className="grid grid-cols-3 items-center gap-2 border-b py-2">
      <div>{activity.activity}</div>
      <div>{activity.newValue}</div>
      <div>{format(activity.createdAt, "MM-dd-yy hh:mm aa")}</div>
    </div>
  );
};
