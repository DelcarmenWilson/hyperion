"use client";

import { Activity } from "@prisma/client";
import { ActivityBox } from "./avtivity-box";

interface ActivityLogProps {
  activities: Activity[];
}

export const ActivityLog = ({ activities }: ActivityLogProps) => {
  return (
    <div className="text-sm">
      <div className="grid grid-cols-3 items-center gap-2 text-md text-muted-foreground">
        <span>Activity</span>
        <span>New value</span>
        <span>Date / Time</span>
      </div>

      {activities?.map((activity) => (
        <ActivityBox key={activity.id} activity={activity} />
      ))}
      {!activities.length && (
        <p className="text-muted-foreground text-center mt-2">
          No activities posted
        </p>
      )}
    </div>
  );
};
