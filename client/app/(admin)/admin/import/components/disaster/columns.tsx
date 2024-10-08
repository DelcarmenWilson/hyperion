"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { LeadMessage } from "@prisma/client";
import { formatDate } from "@/formulas/dates";

export type DisasterType = LeadMessage & {
  agentId: string;
  leadId: string;
};

export const columns: ColumnDef<DisasterType>[] = [
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
    accessorKey: "senderId",
    header: "Sender Id",
  },
  {
    accessorKey: "content",
    header: "Content",
    cell: ({ row }) => (
      <div className=" max-w-[300px]">{row.original.content}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  // {
  //   accessorKey: "role",
  //   header: "Role",
  // },
  {
    accessorKey: "sid",
    header: "Sid",
  },
  // {
  //   accessorKey: "direction",
  //   header: "Direction",
  // },
  // {
  //   accessorKey: "price",
  //   header: "Price",
  // },
  // {
  //   accessorKey: "hasSeen",
  //   header: "Has Seen",
  // },
  // {
  //   accessorKey: "agentId",
  //   header: "Agent Id",
  // },
  // {
  //   accessorKey: "leadId",
  //   header: "Lead Id",
  // },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
];
