"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Carrier } from "@prisma/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/formulas/dates";

export const columns: ColumnDef<Carrier>[] = [
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
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <Image
        height={50}
        width={50}
        className="h-[50px] w-[50px]"
        src={row.original.image || "/assets/defaults/teamImage.jpg"}
        alt={row.original.name}
      />
    ),
  },

  {
    accessorKey: "description",
    header: "Description",
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
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => (
      <Button size="sm" asChild>
        <Link href={`/admin/carrier/${row.original.id}`}>Details</Link>
      </Button>
    ),
  },
];
