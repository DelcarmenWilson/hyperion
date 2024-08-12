"use client";

import { ColumnDef } from "@tanstack/react-table";

import { BluePrint } from "@prisma/client";
import { formatDate } from "@/formulas/dates";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<BluePrint>[] = [
  {
    id: "calls",
    accessorKey: "calls",
    header: "Calls Made",
    enableGlobalFilter: true,
    enableHiding: true,
  },
  {
    id: "callsTarget",
    accessorKey: "callsTarget",
    header: "Calls Target",
    enableGlobalFilter: true,
    enableHiding: true,
    cell: ({ row }) => row.original.callsTarget*row.original.weeks,
  },
  {
    id: "appointments",
    accessorKey: "appointments",
    header: "Apps Made",
    enableGlobalFilter: true,
    enableHiding: true,
  },
  {
    id: "appointmentsTarget",
    accessorKey: "appointmentsTarget",
    header: "Apps Target",
    enableGlobalFilter: true,
    enableHiding: true,
    cell: ({ row }) => row.original.appointmentsTarget*row.original.weeks,
  },
  {
    id: "premium",
    accessorKey: "premium",
    header: "Premium Earned",
    enableGlobalFilter: true,
    enableHiding: true,
  },

  {
    id: "premiumTarget",
    accessorKey: "premiumTarget",
    header: "Premium Target",
    enableGlobalFilter: true,
    enableHiding: true,
    cell: ({ row }) => row.original.premiumTarget*row.original.weeks,
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
    id: "endAt",
    accessorKey: "endAt",
    header: "End At",
    enableHiding: true,
    cell: ({ row }) => formatDate(row.original.endAt),
  },
];
