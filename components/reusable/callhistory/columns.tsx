"use client";
import { format } from "date-fns";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { formatPhoneNumber } from "@/formulas/phones";
import { PhoneOutgoing, X } from "lucide-react";
import { AudioPlayer } from "@/components/custom/audio-player";
import { formatSecondsToTime } from "@/formulas/numbers";
import { FullCall } from "@/types";
import { getPhoneStatusText } from "@/formulas/phone";

export const columns: ColumnDef<FullCall>[] = [
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
          {formatPhoneNumber(
            row.original?.lead
              ? row.original?.lead.cellPhone
              : row.original?.from
          )}
        </p>
        <div className="flex gap-2 items-center">
          {row.original.direction.toLowerCase() === "inbound" ? (
            getPhoneStatusText(row.original.status as string)
          ) : (
            <>
              <PhoneOutgoing size={16} />
              {row.original.direction}
            </>
          )}
        </div>
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
        {row.original.createdAt &&
          format(row.original.createdAt, "MM-dd-yyyy hh:mm aa")}
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
