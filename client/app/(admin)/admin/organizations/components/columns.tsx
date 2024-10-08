"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";

import { FullOrganization } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/formulas/dates";

export const columns: ColumnDef<FullOrganization>[] = [
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
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "teams",
    header: "Teams",
    cell: ({ row }) => <span>{row.original.teams?.length}</span>,
  },
  {
    accessorKey: "createdAt",
    header: "CreatedAt",
    cell: ({ row }) => <span>{formatDate(row.original.createdAt)}</span>,
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => (
      <Button size="sm" asChild>
        <Link href={`/admin/organizations/${row.original.id}`}>Details</Link>
      </Button>
    ),
  },
];
