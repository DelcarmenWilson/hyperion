"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";

import { FullTeam } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/formulas/dates";

export const columns: ColumnDef<FullTeam>[] = [
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
    header: "Team",
  },
  {
    accessorKey: "organization",
    header: "Organization",
    cell: ({ row }) => <span>{row.original.organization.name}</span>,
  },
  {
    accessorKey: "users",
    header: "Users",
    cell: ({ row }) => <span>{row.original.users?.length}</span>,
  },
  {
    accessorKey: "owner",
    header: "Owner",
    cell: ({ row }) => <span>{row.original.owner?.firstName}</span>,
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
        <Link href={`/admin/teams/${row.original.id}`}>Details</Link>
      </Button>
    ),
  },
];
