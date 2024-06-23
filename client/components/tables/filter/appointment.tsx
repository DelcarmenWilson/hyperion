import React, { useEffect } from "react";

import { Table } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apppointmentStatus } from "@/constants/texts";

type AppointmentFilterProps<TData> = {
  table: Table<TData>;
};

export function AppointmentFilter<TData>({
  table,
}: AppointmentFilterProps<TData>) {
  const OnFilter = (column: string, filter: string) => {
    if (filter == "%") {
      filter = "";
    }
    table.getColumn(column)?.setFilterValue(filter);
  };

  useEffect(() => {
    OnFilter("status", "Scheduled");
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <div className="flex items-center gap-2">
        <p className="text-muted-foreground">Status</p>
        <Select
          name="ddlStatus"
          onValueChange={(e) => OnFilter("status", e)}
          defaultValue="Scheduled"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="%">All</SelectItem>
            {apppointmentStatus.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
