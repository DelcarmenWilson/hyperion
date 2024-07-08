import React, { useEffect } from "react";

import { Table } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGlobalContext } from "@/providers/global";
import { states } from "@/constants/states";
import { allVendors } from "@/constants/lead";
import { Button } from "@/components/ui/button";
import { FullLead } from "@/types";

type LeadFilterProps<TData> = {
  table: Table<TData>;
};

export function LeadFilter<TData>({ table }: LeadFilterProps<TData>) {
  const { leadStatus } = useGlobalContext();

  const OnFilter = (column: string, filter: string) => {
    if (filter == "%") {
      filter = "";
    }
    table.getColumn(column)?.setFilterValue(filter);
  };
  const onGetRows = () => {
    const rows = table.getSelectedRowModel().rows;
    const ids: string[] = rows.map((row) => {
      const call = row.original as FullLead;
      return call.id;
    });
    console.log(ids);
    table.resetRowSelection();
  };

  useEffect(() => {
    OnFilter("status", "New");
    // eslint-disable-next-line
  }, []);
  return (
    <>
      {table.getIsAllPageRowsSelected() ||
      (table.getIsSomePageRowsSelected() && "indeterminate") ? (
        <Button onClick={onGetRows}>Get Rows</Button>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground">Status</p>
            <Select
              name="ddlStatus"
              onValueChange={(e) => OnFilter("status", e)}
              defaultValue="New"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="%">All</SelectItem>
                {leadStatus?.map((status) => (
                  <SelectItem key={status.id} value={status.status}>
                    {status.status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-muted-foreground">Vendor</p>
            <Select
              name="ddlVendor"
              defaultValue="%"
              onValueChange={(e) => OnFilter("vendor", e)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="%">All</SelectItem>
                {allVendors.map((vendor) => (
                  <SelectItem key={vendor.name} value={vendor.value}>
                    {vendor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-muted-foreground">State</p>
            <Select
              name="ddlState"
              defaultValue="%"
              onValueChange={(e) => OnFilter("state", e)}
            >
              <SelectTrigger>
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="%">All</SelectItem>
                {states.map((state) => (
                  <SelectItem key={state.state} value={state.abv}>
                    {state.state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </>
  );
}
