"use client";
import Image from "next/image";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { formatter } from "@/lib/utils";
import { FullUserReport } from "@/types";

export const columns: ColumnDef<FullUserReport>[] = [
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
          height={50}
          className="rounded-full shadow-sm shadow-white w-[40px] aspect-square"
          src={row.original.image || "/assets/teamDefaultImage.jpg"}
          alt="Team Image"
        />
      </div>
    ),
  },
  {
    accessorKey: "userName",
    header: "User Name",
  },
  // {
  //   accessorKey: "firstName",
  //   header: "First Name",
  // },
  // {
  //   accessorKey: "lastName",
  //   header: "Last Name",
  // },
  // {
  //   accessorKey: "email",
  //   header: "Email",
  // },

  {
    accessorKey: "calls",
    header: "Calls",
  },
  {
    accessorKey: "conversations",
    header: "Conversations",
  },
  {
    accessorKey: "appointments",
    header: "Appointments",
  },
  {
    accessorKey: "revenue",
    header: "Revenue",
    cell: ({ row }) => formatter.format(row.original.revenue),
  },
  {
    accessorKey: "role",
    header: "Role",
  },
];
