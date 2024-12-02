import React, { useEffect } from "react";

import { Table } from "@tanstack/react-table";

import { FullLead } from "@/types";

import { Button } from "@/components/ui/button";
import { LeadFilterDropDown } from "@/components/lead/filter-dropdown";
import { LeadStatusSelect } from "@/components/lead/select/lead-status-select";
import { LeadVendorSelect } from "@/components/lead/select/vendor-select";
import { LeadStateSelect } from "@/components/lead/select/state-select";
import { useLeadFilterStore } from "@/hooks/lead/use-lead-filter-store";

type LeadFilterProps<TData> = {
  table: Table<TData>;
};

export function LeadFilter<TData>({ table }: LeadFilterProps<TData>) {
  const { statusId, vendor, state, onSetStatus, onSetVendor, onSetState } =
    useLeadFilterStore();
  const OnFilter = (
    column: "statusId" | "vendor" | "state",
    filter: string
  ) => {
    switch (column) {
      case "statusId":
        onSetStatus(filter);
        break;

      case "vendor":
        onSetVendor(filter);
        break;
      case "state":
        onSetState(filter);
        break;
    }
    if (filter == "%") filter = "";

    table.getColumn(column)?.setFilterValue(filter);
  };

  const onGetRows = () => {
    const rows = table.getSelectedRowModel().rows;
    const ids: string[] = rows.map((row) => {
      const call = row.original as FullLead;
      return call.id;
    });
    return ids;
  };
  const onTableClose = () => {
    table.resetRowSelection();
  };

  useEffect(() => {
    OnFilter("statusId", statusId);
    // eslint-disable-next-line
  }, []);
  return (
    <>
      {table.getIsAllPageRowsSelected() ||
      (table.getIsSomePageRowsSelected() && "indeterminate") ? (
        <div className="flex justify-end gap-2 col-span-3">
          <Button variant="outlineprimary" onClick={onTableClose}>
            Cancel
          </Button>
          <LeadFilterDropDown leadIds={onGetRows()} onClose={onTableClose} />
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground">Status</p>
            <LeadStatusSelect
              id="leadFilter"
              statusId={statusId}
              onSetStatus={OnFilter}
            />
          </div>

          <div className="flex items-center gap-2">
            <p className="text-muted-foreground">Vendor</p>
            <LeadVendorSelect vendor={vendor} onSetVendor={OnFilter} filter />
          </div>

          <div className="flex items-center gap-2">
            <p className="text-muted-foreground">State</p>
            <LeadStateSelect state={state} onSetState={OnFilter} filter />
          </div>
        </>
      )}
    </>
  );
}
