"use client";
import { useImageViewer } from "@/hooks/use-image-viewer";
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { UserLicense } from "@prisma/client";
import { formatDate } from "@/formulas/dates";

export const columns: ColumnDef<UserLicense>[] = [
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
    accessorKey: "image",
    header: "Image",
    cell: function CellComponent({ row }) {
      const { onOpen } = useImageViewer();
      return (
        row.original.image && (
          <Image
            className="w-20 h-20 border cursor-pointer hover:border-primary"
            onClick={() => onOpen(row.original.image, row.original.state)}
            width={100}
            height={100}
            src={row.original.image}
            alt={row.original.state}
          />
        )
      );
    },
  },
  {
    accessorKey: "state",
    header: "State",
  },

  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "licenseNumber",
    header: "License Number",
  },

  {
    accessorKey: "dateExpires",
    header: "Date Expires",
    cell: ({ row }) => (
      <span className="text-primary italic font-bold">
        {formatDate(row.original.dateExpires)}
      </span>
    ),
  },
];
