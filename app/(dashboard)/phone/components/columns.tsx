"use client";
import { format } from "date-fns";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Checkbox } from "@/components/ui/checkbox";
import { formatPhoneNumber } from "@/formulas/phones";

export type PhoneNumberColumn = {
  id: string;
  phone: string;
  state: string;
  reneAt: Date;
  status: string;
  updateAt: Date;
};

export const columns: ColumnDef<PhoneNumberColumn>[] = [
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
    header: "Next renewal date",
    cell: ({ row }) => <span>{format(row.original.reneAt, "MM-dd-yy")}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",

    cell: ({ row }) => (
      <div>
        {row.original.status}
        {row.original.status === "Inactive" &&
          ` since ${format(row.original.reneAt, "MM-dd-yy")}`}
      </div>
    ),
  },

  {
    header: "",
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
