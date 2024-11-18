"use client";
import { ColumnDef } from "@tanstack/react-table";

import { BluePrintWeek } from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/formulas/dates";

export const columns: ColumnDef<BluePrintWeek>[] = [
  {
    id: "weekNumber",
    accessorKey: "weekNumber",
    header: "Week Number",
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
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Start At",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    id: "endAt",
    accessorKey: "endAt",
    header: "End At",
    cell: ({ row }) => formatDate(row.original.endAt),
  },
];
