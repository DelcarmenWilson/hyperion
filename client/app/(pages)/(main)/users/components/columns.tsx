"use client";
import Image from "next/image";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { User } from "@prisma/client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        id="cbxMaster"
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
          id={`cbx_${row.original.id}`}
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "image",
    header: "",
    cell: ({ row }) => (
      <div className=" flex justify-center items-center gap-1">
        <Image
          width={40}
          height={40}
          className="rounded-full shadow-sm shadow-white  aspect-square"
          src={row.original.image || "/assets/defaults/teamImage.jpg"}
          alt="Team Image"
        />
      </div>
    ),
  },
  {
    accessorKey: "userName",
    header: "User Name",
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
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => row.original.role.toLowerCase(),
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <Button size="sm" asChild>
        <Link href={`/admin/users/${row.original.id}`}>Details</Link>
      </Button>
    ),
  },
];
