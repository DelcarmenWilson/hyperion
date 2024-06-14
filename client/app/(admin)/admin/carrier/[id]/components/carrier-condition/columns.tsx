"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { FullCarrierCondition } from "@/types";
import { CarrierConditionSchemaType } from "@/schemas/admin";
import { formatDate } from "@/formulas/dates";

export const columns: ColumnDef<FullCarrierCondition>[] = [
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
    accessorKey: "carrier",
    header: "Carrier",
    cell: ({ row }) => <span>{row.original.carrier.name}</span>,
  },
  {
    accessorKey: "condition",
    header: "Condition",
    cell: ({ row }) => <span>{row.original.condition.name}</span>,
  },
  {
    accessorKey: "requirements",
    header: "Requirements",
  },
  {
    accessorKey: "creatAt",
    header: "Created At",
    cell: ({ row }) => (
      <span className="text-primary italic font-bold">
        {formatDate(row.original.createdAt)}
      </span>
    ),
  },
];

export const importColumns: ColumnDef<CarrierConditionSchemaType>[] = [
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
    accessorKey: "condition",
    header: "Condition",
  },
  {
    accessorKey: "requirements",
    header: "Requirements",
  },
  {
    accessorKey: "requirements",
    header: "notes",
  },
];
