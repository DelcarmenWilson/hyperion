"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { formatDateTime } from "@/formulas/dates";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { useLeadActivityData } from "@/hooks/lead/use-activity";

const types = [
  "Caller Id",
  "General",
  "Main",
  "Notes",
  "Quote",
  "Sale",
  "Status",
];

export const ActivityList = () => {
  const { activities, isFetchingActivities, onSetActivities } =
    useLeadActivityData();

  return (
    <div className="text-sm">
      <div className="flex items-center gap-2 p-2">
        <p className="text-muted-foreground">Type</p>
        <Select
          name="ddlType"
          onValueChange={(e) => onSetActivities(e)}
          defaultValue={"%"}
          autoComplete="address-level1"
        >
          <SelectTrigger className="max-w-28">
            <SelectValue placeholder="Select Type" />
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

      <SkeletonWrapper isLoading={isFetchingActivities}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Activity</TableHead>
              <TableHead>Old value</TableHead>
              <TableHead>Date / Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities?.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>{activity.activity}</TableCell>
                <TableCell>{activity.newValue}</TableCell>
                <TableCell>{formatDateTime(activity.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SkeletonWrapper>
      {!activities?.length && (
        <p className="text-muted-foreground text-center mt-2">
          No activities posted
        </p>
      )}
    </div>
  );
};
