"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { UserLicense } from "@prisma/client";
import { formatDate } from "@/formulas/dates";

export const columns: ColumnDef<UserLicense>[] = [
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
    accessorKey: "state",
    header: "State",
  },

  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "licenseNumber",
    header: "License Number",
  },

  {
    accessorKey: "dateExpires",
    header: "Date Expires",
    cell: ({ row }) => (
      <span className="text-primary italic font-bold">
        {formatDate(row.original.dateExpires)}
      </span>
    ),
  },
];
