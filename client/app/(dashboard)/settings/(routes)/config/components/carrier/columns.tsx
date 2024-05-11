"use client";
import { format } from "date-fns";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { FullUserCarrier } from "@/types";

export const columns: ColumnDef<FullUserCarrier>[] = [
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
    accessorKey: "carrier",
    header: "Carrier",
    cell: ({ row }) => <span>{row.original.carrier.name}</span>,
  },
  {
    accessorKey: "agentId",
    header: "Agent Id",
  },
  {
    accessorKey: "dateExpires",
    header: "Date Expires",
    cell: ({ row }) => (
      <span className="text-primary italic font-bold">
        {format(row.original.createdAt, "MM-dd-yy")}
      </span>
    ),
  },
];
