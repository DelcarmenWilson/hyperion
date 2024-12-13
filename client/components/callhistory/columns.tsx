"use client";
import { ArrowUpDown, PhoneOutgoing, X } from "lucide-react";
import Link from "next/link";

import { FullCall } from "@/types";

import { AppointmentDetails } from "../lead/appointments/details-appointment-dialog";
import { Button } from "@/components/ui/button";
import { CallHistoryActions } from "./actions";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";

import { formatDateTime } from "@/formulas/dates";
import { formatSecondsToTime } from "@/formulas/numbers";
import { formatPhoneNumber } from "@/formulas/phones";
import { getPhoneStatusText } from "@/formulas/phone";

export const columns: ColumnDef<FullCall>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
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
        {row.original?.lead ? (
          <Link
            className="text-primary font-bold italic"
            href={`/leads/${row.original.lead.id}`}
          >
            {formatPhoneNumber(row.original?.lead.cellPhone)}
          </Link>
        ) : (
          <span className="text-primary font-bold italic">
            {formatPhoneNumber(row.original.from)}
          </span>
        )}

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
      <span>
        {row.original.duration && formatSecondsToTime(row.original.duration)}
      </span>
    ),
  },

  {
    accessorKey: "date",
    header: "Date/Time",
    cell: ({ row }) => <div>{formatDateTime(row.original.createdAt)}</div>,
  },

  {
    accessorKey: "appointmentId",
    header: "Appointment",
    cell: ({ row }) => {
      return (
        row.original.appointment && (
          <AppointmentDetails
            status={row.original.appointment.status}
            firstName={row.original.lead?.firstName!}
            lastName={row.original.lead?.lastName!}
            startDate={row.original.appointment.startDate}
            localDate={row.original.appointment.localDate}
            cellPhone={row.original.lead?.cellPhone!}
            email={row.original.lead?.email!}
            comments={row.original.appointment.comments}
            reason={row.original.appointment.reason}
          />
        )
      );
    },
  },

  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => <CallHistoryActions call={row.original} />,
  },
];
