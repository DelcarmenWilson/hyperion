"use client";

import { ColumnDef } from "@tanstack/react-table";

import { BluePrintWeek } from "@prisma/client";
import { formatDate } from "@/formulas/dates";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<BluePrintWeek>[] = [
  {
    id: "callsTarget",
    accessorKey: "callsTarget",
    header: "Calls Target",
    enableGlobalFilter: true,
    enableHiding: true,
  },
  {
    id: "calls",
    accessorKey: "calls",
    header: "Calls Made",
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
    id: "appointments",
    accessorKey: "appointments",
    header: "Apps Made",
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
    id: "premium",
    accessorKey: "premium",
    header: "Premium Earned",
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
    id: "startDate",
    accessorKey: "startDate",
    header: "Started At",
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

 
];
