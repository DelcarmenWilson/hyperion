"use client";

import { LeadBeneficiary } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { formatPhoneNumber } from "@/formulas/phones";
import { formatDate } from "@/formulas/dates";

export const columns: ColumnDef<LeadBeneficiary>[] = [
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
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "relationship",
    header: "Relationship",
  },
  {
    accessorKey: "share",
    header: "Share",
  },
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "cellPhone",
    header: "Cell Phone",
    cell: ({ row }) => formatPhoneNumber(row.original.cellPhone),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "ssn",
    header: "ssn",
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
