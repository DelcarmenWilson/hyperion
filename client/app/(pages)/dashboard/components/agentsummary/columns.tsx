"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CellAction } from "./cell-action";
import { formatDateTime } from "@/formulas/dates";

export type AgentSummaryColumn = {
  id: string;
  username: string;
  email?: string;
  subscriptionExpires: string;
  balance: string;
  leadsPending: string;
  carrierViolations: string;
  coaching: boolean;
  currentCall: string;
};

export const columns: ColumnDef<AgentSummaryColumn>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "username",
    header: "My team",
    cell: ({ row }) => (
      <div>
        <p className="capitalize">{row.original.username}</p>
        <p className="lowercase">{row.original.email}</p>
      </div>
    ),
  },
  {
    accessorKey: "subscriptionExpires",
    header: "Subscription expires",
    cell: ({ row }) => (
      <div>
        <p className="capitalize">
          {formatDateTime(row.original.subscriptionExpires)}
          {/* {format(
            new Date(row.original.subscriptionExpires),
            "MM-dd-yyyy hh:mm aaaaa'M'"
          )} */}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        ${row.original.balance}
        <Button size="sm">FUND</Button>
      </div>
    ),
  },
  {
    accessorKey: "leadsPending",
    header: "Leads pending",
  },
  {
    accessorKey: "carrierViolations",
    header: "Carrier violations",
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => <CellAction agent={row.original} />,
  },
];
