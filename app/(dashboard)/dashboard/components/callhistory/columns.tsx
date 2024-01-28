"use client";
import { format } from "date-fns";

import { ColumnDef } from "@tanstack/react-table";
// import { CellAction } from "./cell-action";
import { Checkbox } from "@/components/ui/checkbox";
import { formatPhoneNumber } from "@/formulas/phones";
import { MoveDownLeft, MoveUpRight } from "lucide-react";

export type CallHistoryColumn = {
  id: string;
  agentName: string;
  phone: string;
  direction: string;
  fullName: string;
  email: string;
  duration: string;
  date: Date;
};

export const columns: ColumnDef<CallHistoryColumn>[] = [
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
    accessorKey: "agentName",
    header: "Agent",
  },
  {
    accessorKey: "phone",
    header: "Phone Number",
    cell: ({ row }) => (
      <div>
        <p className="text-primary font-bold italic">
          {formatPhoneNumber(row.original.phone)}
        </p>
        <p className="flex gap-2 items-center">
          {row.original.direction === "Inbound" ? (
            <MoveDownLeft className="h-4 w-4" />
          ) : (
            <MoveUpRight className="h-4 w-4" />
          )}
          {row.original.direction}
        </p>
      </div>
    ),
  },

  {
    accessorKey: "fullName",
    header: "Lead info",
    cell: ({ row }) => (
      <div>
        <p className="capitalize">{row.original.fullName}</p>
        <p className="lowercase">{row.original.email}</p>
      </div>
    ),
  },

  {
    accessorKey: "timeZone",
    header: "Time Zone",
  },
  {
    accessorKey: "duration",
    header: "Duration",
  },

  {
    accessorKey: "date",
    header: "Date/Time",
    cell: ({ row }) => (
      <div>
        <p className="capitalize">
          {format(row.original.date, "MM-dd-yyyy hh:mm aaaaa'M'")}
        </p>
      </div>
    ),
  },

  // {
  //   header: "Actions",
  //   id: "actions",
  //   cell: ({ row }) => <CellAction data={row.original} />,
  // },
];
