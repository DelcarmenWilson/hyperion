"use client";
import { useState } from "react";

import { LeadActivity } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ActivityCard } from "./card";

type ActivityLogProps = {
  initActivities: LeadActivity[];
};
const types = [
  "Caller Id",
  "General",
  "Main",
  "Notes",
  "Quote",
  "Sale",
  "Status",
];

export const ActivityList = ({ initActivities }: ActivityLogProps) => {
  const [activities, setActivities] = useState(initActivities);

  const onSetActivities = (type: string) => {
    setActivities(
      initActivities.filter((e) => e.type.includes(type == "%" ? "" : type))
    );
  };
  return (
    <div className="text-sm">
      <div className="flex items-center gap-2">
        <p className="text-muted-foreground">Type</p>
        <Select
          name="ddlType"
          onValueChange={(e) => onSetActivities(e)}
          defaultValue={"%"}
          autoComplete="address-level1"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select State" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="%">All</SelectItem>
            {types.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-3 items-center gap-2 text-md text-muted-foreground">
        <span>Activity</span>
        <span>Old value</span>
        <span>Date / Time</span>
      </div>

      {activities?.map((activity) => (
        <ActivityCard key={activity.id} activity={activity} />
      ))}
      {!activities.length && (
        <p className="text-muted-foreground text-center mt-2">
          No activities posted
        </p>
      )}
    </div>
  );
};
