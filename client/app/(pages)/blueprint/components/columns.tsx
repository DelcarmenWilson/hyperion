"use client";

import { ColumnDef } from "@tanstack/react-table";

import { BluePrint } from "@prisma/client";
import { formatDate } from "@/formulas/dates";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<BluePrint>[] = [
  {
    id: "callsTarget",
    accessorKey: "callsTarget",
    header: "Calls Target",
    enableGlobalFilter: true,
    enableHiding: true,
  },
  {
    id: "appointmentsTarget",
    accessorKey: "appointmentsTarget",
    header: "Apps Target",
    enableGlobalFilter: true,
    enableHiding: true,
  },

  {
    id: "premiumTarget",
    accessorKey: "premiumTarget",
    header: "Premium Target",
    enableGlobalFilter: true,
    enableHiding: true,
  },

  {
    id: "active",
    accessorKey: "active",
    header: "Active",

    cell: ({ row }) => <Checkbox disabled checked={row.original.active} />,
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Start At",
    enableHiding: true,
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    id: "endDate",
    accessorKey: "endDate",
    header: "End At",
    enableHiding: true,
    cell: ({ row }) => formatDate(row.original.endDate),
  },

  {
    id: "updatedAt",
    accessorKey: "updatedAt",
    header: "Updated At",
    enableHiding: true,
    cell: ({ row }) => formatDate(row.original.updatedAt),
  },
];
