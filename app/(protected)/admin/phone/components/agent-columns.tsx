"use client";
import { format } from "date-fns";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Checkbox } from "@/components/ui/checkbox";
import { formatPhoneNumber } from "@/formulas/phones";
import { FullPhoneNumber } from "@/types";

export const columns: ColumnDef<FullPhoneNumber>[] = [
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
    accessorKey: "firstName",
    header: "Agent",
    cell: ({ row }) => (
      <span>{`${row.original.agent?.firstName} ${row.original.agent?.lastName}`}</span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone number",
    cell: ({ row }) => <span>{formatPhoneNumber(row.original.phone)}</span>,
  },
  {
    accessorKey: "state",
    header: "State",
  },
  {
    accessorKey: "renewAt",
    header: "Renew date",
    cell: ({ row }) => <span>{format(row.original.renewAt, "MM-dd-yy")}</span>,
  },
  {
    accessorKey: "createdAt",
    header: "Create At",
    cell: ({ row }) => (
      <span>{format(row.original.createdAt, "MM-dd-yy")}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",

    cell: ({ row }) => (
      <div>
        {row.original.status}
        {row.original.status === "Inactive" &&
          ` since ${format(row.original.updatedAt, "MM-dd-yy")}`}
      </div>
    ),
  },
];
