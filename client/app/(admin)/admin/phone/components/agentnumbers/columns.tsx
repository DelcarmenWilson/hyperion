"use client";
import { FullPhoneNumber } from "@/types";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import UpdatePhoneNumberDialog from "../update-phone-number-dialog";
import { formatDate } from "@/formulas/dates";

import { formatPhoneNumber } from "@/formulas/phones";

export const columns: ColumnDef<FullPhoneNumber>[] = [
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
    accessorKey: "firstName",
    header: "Agent",
    cell: ({ row }) => (
      <span>{`${row.original.agent?.firstName} ${row.original.agent?.lastName}`}</span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone number",
    cell: ({ row }) => <span>{formatPhoneNumber(row.original.phone)}</span>,
  },
  {
    accessorKey: "state",
    header: "State",
  },
  {
    accessorKey: "renewAt",
    header: "Renew date",
    cell: ({ row }) => <span>{formatDate(row.original.renewAt)}</span>,
  },
  {
    accessorKey: "createdAt",
    header: "Create At",
    cell: ({ row }) => <span>{formatDate(row.original.createdAt)}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",

    cell: ({ row }) => (
      <div>
        {row.original.status}
        {row.original.status === "Inactive" &&
          ` since ${formatDate(row.original.updatedAt)}`}
      </div>
    ),
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => <UpdatePhoneNumberDialog phoneNumber={row.original} />,
  },
];
