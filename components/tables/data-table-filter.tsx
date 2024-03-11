import React from "react";

import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGlobalContext } from "@/providers/global-provider";
import { states } from "@/constants/states";
import { allVendors } from "@/constants/lead";

type DataTableFilter<TData> = {
  table: Table<TData>;
  filtering: string;
  setFiltering: (e: string) => void;
  placeHolder: string;
};

export function DataTableFilter<TData>({
  table,
  filtering,
  setFiltering,
  placeHolder,
}: DataTableFilter<TData>) {
  const { leadStatus } = useGlobalContext();
  const OnFilter = (column: string, filter: string) => {
    if (filter == "%") {
      filter = "";
    }
    table.getColumn(column)?.setFilterValue(filter);
  };

  return (
    <div className="grid grid-cols-4 gap-2 mt-2">
      <Input
        placeholder={placeHolder}
        value={filtering}
        onChange={(event) => setFiltering(event.target.value)}
      />

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
    </div>
  );
}
