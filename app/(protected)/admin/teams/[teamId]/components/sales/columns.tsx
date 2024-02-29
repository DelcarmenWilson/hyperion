"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { Sales } from "@/types";
import { format } from "date-fns";
import { USDollar } from "@/formulas/numbers";

export const columns: ColumnDef<Sales>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        value="all"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "agent",
    header: "Agent",
    cell: ({ row }) => <span>{row.original.user.firstName}</span>,
  },
  {
    accessorKey: "lead",
    header: "Lead",
    cell: ({ row }) => <span>{row.original.firstName}</span>,
  },
  {
    accessorKey: "sale",
    header: "Sale",
    cell: ({ row }) =>
      USDollar.format(parseInt(row.original.saleAmount as string)),
  },
  {
    accessorKey: "saleDate",
    header: "Sale Date",
    cell: ({ row }) => format(row.original.updatedAt, "MM-dd-yyy"),
  },
];
