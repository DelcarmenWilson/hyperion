"use client";
import { formatDateTime } from "@/formulas/dates";
import { Activity } from "@prisma/client";

export const ActivityCard = ({ activity }: { activity: Activity }) => {
  return (
    <div className="grid grid-cols-3 items-center gap-2 border-b py-3">
      <div>{activity.activity}</div>
      <div>{activity.newValue}</div>
      <div>{formatDateTime(activity.createdAt)}</div>
    </div>
  );
};
