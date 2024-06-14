"use client";
import { ArrowUpDown, PhoneOutgoing, X } from "lucide-react";
import { FullCall } from "@/types";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import { formatSecondsToTime } from "@/formulas/numbers";
import { formatPhoneNumber } from "@/formulas/phones";
import { getPhoneStatusText } from "@/formulas/phone";
import { CallHistoryActions } from "./actions";
import { formatDateTime } from "@/formulas/dates";

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
  {
    id: "direction",
    accessorKey: "direction",
    enableGlobalFilter: true,
    enableHiding: true,
  },

  {
    id: "status",
    accessorKey: "status",
    enableGlobalFilter: true,
    enableHiding: true,
  },

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
    header: "Lead Info",
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
    // header: "Duration",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Duration
          <ArrowUpDown size={16} className="ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>
        {row.original.duration && formatSecondsToTime(row.original.duration)}
      </div>
    ),
  },

  {
    accessorKey: "date",
    header: "Date/Time",
    cell: ({ row }) => <div>{formatDateTime(row.original.createdAt)}</div>,
  },

  {
    header: "Recording",
    id: "actions",
    cell: ({ row }) => (
      <CallHistoryActions
        id={row.original.id}
        userId={row.original.userId}
        shared={row.original.shared}
        recordUrl={row.original.recordUrl!}
      />
    ),
  },
];
