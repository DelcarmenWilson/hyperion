"use client";
import { ColumnDef } from "@tanstack/react-table";
import { LoginStatus } from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate, formatDateTime } from "@/formulas/dates";
import { formatSecondsToHours } from "@/formulas/numbers";

export const columns: ColumnDef<LoginStatus>[] = [
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
        className="absolute -top-20 -left-1"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Login",
    cell: ({ row }) => (
      <span className="text-primary italic font-bold">
        {formatDateTime(row.original.createdAt)}
      </span>
    ),
  },
  {
    id: "updatedAt",
    accessorKey: "updatedAt",
    header: "Logoff",
    cell: ({ row }) => (
      <span className="text-primary italic font-bold">
        {formatDateTime(row.original.updatedAt)}
      </span>
    ),
  },

  {
    id: "duration",
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => (
      <span className="font-bold">
        {formatSecondsToHours(row.original.duration)}
      </span>
    ),
  },
];
