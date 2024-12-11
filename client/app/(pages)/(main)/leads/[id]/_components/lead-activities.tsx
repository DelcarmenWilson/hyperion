"use client";
import { useLeadActivityData } from "@/hooks/lead/use-activity";
import { LeadActivity } from "@prisma/client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { formatDateTime } from "@/formulas/dates";

const types = [
  "Caller Id",
  "General",
  "Main",
  "Notes",
  "Quote",
  "Sale",
  "Status",
];
//TODO - need to give some TLC to this Component
const LeadActivities = () => {
  const { activities, isFetchingActivities, onSetActivities } =
    useLeadActivityData();

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

      {!activities && (
        <p className="text-muted-foreground text-center mt-2">
          No activities posted
        </p>
      )}
      {activities?.map((activity) => (
        <ActivityCard key={activity.id} activity={activity} />
      ))}
    </div>
  );
};

const ActivityCard = ({ activity }: { activity: LeadActivity }) => {
  return (
    <div className="grid grid-cols-3 items-center gap-2 border-b py-2">
      <div>{activity.activity}</div>
      <div>{activity.newValue}</div>
      <div>{formatDateTime(activity.createdAt)}</div>
    </div>
  );
};

export default LeadActivities;
