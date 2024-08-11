"use client";

import { ColumnDef } from "@tanstack/react-table";

import { BluePrintWeek } from "@prisma/client";
import { formatDate } from "@/formulas/dates";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<BluePrintWeek>[] = [
  {
    id: "weekNumber",
    accessorKey: "weekNumber",
    header: "weekNumber",
  },
  {
    id: "callsTarget",
    accessorKey: "callsTarget",
    header: "Calls Target",
  },
  {
    id: "calls",
    accessorKey: "calls",
    header: "Calls Made",
  },

  {
    id: "appointmentsTarget",
    accessorKey: "appointmentsTarget",
    header: "Apps Target",
  },

  {
    id: "appointments",
    accessorKey: "appointments",
    header: "Apps Made",
  },

  {
    id: "premiumTarget",
    accessorKey: "premiumTarget",
    header: "Premium Target",
  },

  {
    id: "premium",
    accessorKey: "premium",
    header: "Premium Earned",
  },

  {
    id: "active",
    accessorKey: "active",
    header: "Active",

    cell: ({ row }) => <Checkbox disabled checked={row.original.active} />,
  },
  {
    id: "startAt",
    accessorKey: "startAt",
    header: "Start At",
    cell: ({ row }) => formatDate(row.original.startAt),
  },
  {
    id: "endAt",
    accessorKey: "endAt",
    header: "End At",
    cell: ({ row }) => formatDate(row.original.endAt),
  },
];
