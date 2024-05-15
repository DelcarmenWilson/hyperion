"use client";
import { format } from "date-fns";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FullTermCarrier } from "@/types";

export const columns: ColumnDef<FullTermCarrier>[] = [
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
    accessorKey: "carrierId",
    header: "Carrier",
    cell: ({ row }) => row.original.carrier.name,
  },
  {
    accessorKey: "conditionId",
    header: "Condition",
    cell: ({ row }) => row.original.condition.name,
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
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => (
      <span className="text-primary italic font-bold">
        {format(row.original.updatedAt, "MM-dd-yy")}
      </span>
    ),
  },
  // {
  //   header: "Actions",
  //   id: "actions",
  //   cell: ({ row }) => (
  //     <Button size="sm" asChild>
  //       <Link href={`/admin/carrier/${row.original.id}`}>Details</Link>
  //     </Button>
  //   ),
  // },
];
