"use client";
import { FullLeadMedicalCondition } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/formulas/dates";

export const columns: ColumnDef<FullLeadMedicalCondition>[] = [
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
    accessorKey: "condition.condition.name",
    header: "Condition",
    cell: ({ row }) => row.original.condition.name,
  },
  {
    accessorKey: "diagnosed",
    header: "Date Diagnosed",
    cell: ({ row }) => formatDate(row.original.diagnosed),
  },
  {
    accessorKey: "medications",
    header: "Medications",
  },

  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <span className="text-primary italic font-bold">
        {formatDate(row.original.createdAt)}
      </span>
    ),
  },
  // {
  //   header: "Actions",
  //   id: "actions",
  //   cell: ({ row }) => (
  //     <Button size="sm" asChild>
  //       <Link href={`/admin/tasks/${row.original.id}`}>Details</Link>
  //     </Button>
  //   ),
  // },
];
