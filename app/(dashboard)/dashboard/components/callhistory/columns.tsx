"use client";
import { format } from "date-fns";

import { ColumnDef } from "@tanstack/react-table";
// import { CellAction } from "./cell-action";
import { Checkbox } from "@/components/ui/checkbox";
import { formatPhoneNumber } from "@/formulas/phones";
import { MoveDownLeft, MoveUpRight } from "lucide-react";
import { AudioPlayer } from "@/components/custom/audio-player";
import { formatSecondsToTime } from "@/formulas/numbers";
import { FullCall } from "@/types";
import { Lead } from "@prisma/client";

export type CallHistoryColumn = {
  id: string;
  agentName: string;
  from: string;
  phone: string;
  direction: string;
  fullName: string;
  email: string;
  duration: number;
  date: Date;
  recordUrl: string;
  lead?: Lead | undefined;
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
  // {
  //   accessorKey: "agentName",
  //   header: "Agent",
  // },
  {
    accessorKey: "phone",
    header: "Phone Number",
    cell: ({ row }) => (
      <div>
        <p className="text-primary font-bold italic">
          {row.original?.lead
            ? formatPhoneNumber(row.original?.lead.cellPhone)
            : formatPhoneNumber(row.original?.from)}
        </p>
        <p className="flex gap-2 items-center">
          {row.original.direction.toLowerCase() === "inbound" ? (
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
        <p className="capitalize">
          {row.original.lead
            ? `${row.original.lead.firstName} ${row.original.lead.lastName}`
            : "Unknown Caller"}
        </p>
        <p className="lowercase">{row.original.lead?.email}</p>
      </div>
    ),
  },

  // {
  //   accessorKey: "timeZone",
  //   header: "Time Zone",
  // },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => (
      <div>
        {row.original.duration && formatSecondsToTime(row.original.duration)}
      </div>
    ),
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

  {
    header: "Recording",
    id: "actions",
    cell: ({ row }) => (
      <div>
        {row.original.recordUrl && <AudioPlayer src={row.original.recordUrl} />}
      </div>
    ),
  },
];
