"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { LeadCommunication } from "@prisma/client";

export const columns: ColumnDef<LeadCommunication>[] = [
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
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "userId",
    header: "User Id",
  },
  {
    accessorKey: "leadId",
    header: "Lead Id",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "direction",
    header: "Direction",
  },
  {
    accessorKey: "duration",
    header: "Duration",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
];
