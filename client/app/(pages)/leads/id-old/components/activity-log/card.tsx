"use client";
import { LeadActivity } from "@prisma/client";
import { formatDateTime } from "@/formulas/dates";

export const ActivityCard = ({ activity }: { activity: LeadActivity }) => {
  return (
    <div className="grid grid-cols-3 items-center gap-2 border-b py-2">
      <div>{activity.activity}</div>
      <div>{activity.newValue}</div>
      <div>{formatDateTime(activity.createdAt)}</div>
    </div>
  );
};
