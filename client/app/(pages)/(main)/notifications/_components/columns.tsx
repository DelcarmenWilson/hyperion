"use client";
import { Notification } from "@prisma/client";

import { ColumnDef } from "@tanstack/react-table";
import NotificationActions from "@/components/global/notification-actions";

import { formatDateTime } from "@/formulas/dates";

export const columns: ColumnDef<Notification>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  // {
  //   id: "direction",
  //   accessorKey: "direction",
  //   enableGlobalFilter: true,
  //   enableHiding: true,
  // },

  {
    id: "title",
    header: "Title",
    accessorKey: "title",
  },
  {
    id: "content",
    header: "Content",
    accessorKey: "content",
  },
  // {
  //   id: "linkText",
  //   accessorKey: "linkText",
  // },
  // {
  //   id: "link",
  //   accessorKey: "link",

  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => <span>{formatDateTime(row.original.createdAt)}</span>,
  },

  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => (
      <NotificationActions
        link={row.original.link}
        linkText={row.original.linkText}
      />
    ),
  },
];
