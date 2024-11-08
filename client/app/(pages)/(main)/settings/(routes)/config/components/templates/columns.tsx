"use client";
import { useImageViewer } from "@/hooks/use-image-viewer";
import Image from "next/image";
import { UserTemplate } from "@prisma/client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/formulas/dates";

export const columns: ColumnDef<UserTemplate>[] = [
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
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },

  {
    accessorKey: "message",
    header: "message",
  },
  {
    accessorKey: "attachment",
    header: "Attachment",
    cell: function CellComponent({ row }) {
      const { onOpen } = useImageViewer();
      return (
        row.original.attachment && (
          <Image
            className="w-20 h-20 border cursor-pointer hover:border-primary"
            onClick={() => onOpen(row.original.attachment, "Attachment Image")}
            width={100}
            height={100}
            src={row.original.attachment}
            alt="Attachment Image"
          />
        )
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: "Date Created",
    cell: ({ row }) => (
      <span className="text-primary italic font-bold">
        {formatDate(row.original.createdAt)}
      </span>
    ),
  },
];
