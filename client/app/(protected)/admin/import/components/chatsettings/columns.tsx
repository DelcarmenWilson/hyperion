"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { ChatSettings } from "@prisma/client";

export const columns: ColumnDef<ChatSettings>[] = [
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
    accessorKey: "userId",
    header: "User Id",
  },
  {
    accessorKey: "leadInfo",
    header: "Lead Info",
  },
  {
    accessorKey: "autoChat",
    header: "Auto Chat",
  },
  {
    accessorKey: "record",
    header: "Record",
  },
  {
    accessorKey: "coach",
    header: "Coach",
  },
];
