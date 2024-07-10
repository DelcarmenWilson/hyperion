"use client";

import { ColumnDef } from "@tanstack/react-table";
import { LeadDuplicates } from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<LeadDuplicates>[] = [
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
    id: "firstName",
    accessorKey: "firstName",
    enableGlobalFilter: true,
    header: "First Name",
  },
  {
    id: "lastName",
    accessorKey: "lastName",
    enableGlobalFilter: true,
    header: "Last Name",
  },
  {
    id: "cellPhone",
    accessorKey: "cellPhone",
    header: "Cell Phone",
    enableGlobalFilter: true,
  },
  {
    id: "email",
    accessorKey: "email",
    enableGlobalFilter: true,
    header: "Email",
  },

  {
    id: "vendor",
    accessorKey: "vendor",
    header: "Vendor",
  },
  {
    id: "state",
    accessorKey: "state",
    header: "State",
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
  },
];
