import React, { useEffect } from "react";
import { useAppointmentStore } from "@/stores/appointment-store";

import { AppointmentStatus } from "@/types/appointment";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table } from "@tanstack/react-table";

import { getEnumValues } from "@/lib/helper/enum-converter";
import { capitalize } from "@/formulas/text";

type AppointmentFilterProps<TData> = {
  table: Table<TData>;
};

export function AppointmentFilter<TData>({
  table,
}: AppointmentFilterProps<TData>) {
  const { status, onSetStatus } = useAppointmentStore();
  const statuses = getEnumValues(AppointmentStatus);
  const OnFilter = (column: string, filter: string) => {
    onSetStatus(filter);
    if (filter == "%") {
      filter = "";
    }
    table.getColumn(column)?.setFilterValue(filter);
  };

  useEffect(() => {
    OnFilter("status", status);
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <div className="flex items-center gap-2">
        <p className="text-muted-foreground">Status</p>
        <Select
          name="ddlStatus"
          onValueChange={(e) => OnFilter("status", e)}
          defaultValue={status}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="%">All</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                <span>{capitalize(status.name)}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
