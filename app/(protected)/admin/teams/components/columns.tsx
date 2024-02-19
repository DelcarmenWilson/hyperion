"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { FullTeam } from "@/types";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
    cell: ({ row }) => (
      <span>{format(row.original.createdAt, "MM-dd-yyyy")}</span>
    ),
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => (
      <Button asChild>
        <Link href={`/admin/teams/${row.original.id}`}>Details</Link>
      </Button>
    ),
  },
];
