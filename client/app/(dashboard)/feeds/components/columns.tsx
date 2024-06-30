"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";

import { Feed } from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/formulas/dates";

export const columns: ColumnDef<Feed>[] = [
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
    accessorKey: "content",
    header: "Content",
    enableGlobalFilter: true,
    cell: ({ row }) => (
      <div className="max-w-[400px] ">{row.original.content}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => <span>{formatDate(row.original.createdAt)}</span>,
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => <span>{formatDate(row.original.updatedAt)}</span>,
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) =>
      row.original.link && (
        <Button size="sm" asChild>
          <Link href={row.original.link}>Details</Link>
        </Button>
      ),
  },
];
