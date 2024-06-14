"use client";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Task } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/formulas/dates";

export const columns: ColumnDef<Task>[] = [
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
    accessorKey: "headLine",
    header: "HeadLine",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "startAt",
    header: "Start At",
    cell: ({ row }) => (
      <span className="text-primary italic font-bold">
        {formatDate(row.original.startAt)}
      </span>
    ),
  },
  {
    accessorKey: "endAt",
    header: "End At",
    cell: ({ row }) => (
      <span className="text-primary italic font-bold">
        {formatDate(row.original.endAt)}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <span className="text-primary italic font-bold">
        {formatDate(row.original.createdAt)}
      </span>
    ),
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => (
      <Button size="sm" asChild>
        <Link href={`/admin/tasks/${row.original.id}`}>Details</Link>
      </Button>
    ),
  },
];
