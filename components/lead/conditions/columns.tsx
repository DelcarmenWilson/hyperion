"use client";
import { format } from "date-fns";
import Link from "next/link";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FullLeadMedicalCondition } from "@/types";

export const columns: ColumnDef<FullLeadMedicalCondition>[] = [
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
    accessorKey: "condition.condition.name",
    header: "Condition",
    cell: ({ row }) => row.original.condition.name,
  },
  {
    accessorKey: "diagnosed",
    header: "Date Diagnosed",
    cell: ({ row }) => format(row.original.diagnosed, "MM-dd-yy"),
  },
  {
    accessorKey: "medications",
    header: "Medications",
  },

  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <span className="text-primary italic font-bold">
        {format(row.original.createdAt, "MM-dd-yy")}
      </span>
    ),
  },
  // {
  //   header: "Actions",
  //   id: "actions",
  //   cell: ({ row }) => (
  //     <Button size="sm" asChild>
  //       <Link href={`/admin/tasks/${row.original.id}`}>Details</Link>
  //     </Button>
  //   ),
  // },
];
