"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { Schedule } from "@prisma/client";

export const columns: ColumnDef<Schedule>[] = [
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
    accessorKey: "userId",
    header: "user Id",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "subTitle",
    header: "Sub Title",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "sunday",
    header: "Sunday",
  },
  {
    accessorKey: "monday",
    header: "Monday",
  },
  {
    accessorKey: "tuesday",
    header: "Tuesday",
  },
  {
    accessorKey: "wednesday",
    header: "Wednesday",
  },
  {
    accessorKey: "thursday",
    header: "Thursday",
  },
  {
    accessorKey: "friday",
    header: "Friday",
  },
  {
    accessorKey: "saturday",
    header: "Saturday",
  },
];
