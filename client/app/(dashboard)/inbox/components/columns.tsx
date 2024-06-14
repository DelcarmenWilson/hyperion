"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

import { Actions } from "./actions";
import { Message } from "./message";
import { formatDateTime } from "@/formulas/dates";

export type InboxColumn = {
  id: string;
  fullName: string;
  disposition: string;
  cellPhone: string;
  message: string;
  updatedAt: Date;
  unread: number;
};

export const columns: ColumnDef<InboxColumn>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        value="all"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
        <Actions id={row.original.id} />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "fullName",
    header: "From",
    cell: ({ row }) => (
      <div className="flex flex-col gap-2">
        <p>{row.original.fullName}</p>
        <p>{row.original.cellPhone}</p>
      </div>
    ),
  },
  // {
  //   accessorKey: "disposition",
  //   header: "disposition",
  // },
  {
    accessorKey: "message",
    header: "message",
    cell: ({ row }) => (
      <Message
        conversationId={row.original.id}
        message={row.original.message}
        count={row.original.unread}
      />
    ),
  },

  {
    accessorKey: "createdAt",
    header: "Recieved on",
    cell: ({ row }) => (
      <div>
        {row.original.updatedAt && formatDateTime(row.original.updatedAt)}
      </div>
    ),
  },
];
