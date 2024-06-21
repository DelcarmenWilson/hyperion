"use client";
import Link from "next/link";
import { FullAppointment } from "@/types";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

import { formatPhoneNumber } from "@/formulas/phones";
import {
  formatDateTime,
  formatDob,
  formatTime,
  getAge,
} from "@/formulas/dates";

export const columns: ColumnDef<FullAppointment>[] = [
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
    accessorKey: "fullName",
    header: "Appointment with",
    cell: ({ row }) => (
      <div>
        <p className="capitalize font-bold">
          {row.original.lead.firstName} {row.original.lead.lastName}
        </p>

        <Link
          className="text-primary font-bold opacity-80 hover:underline italic"
          href={`/leads/${row.original.lead.id}`}
        >
          {formatPhoneNumber(row.original.lead.cellPhone)}
        </Link>
        <p className="lowercase">{row.original.lead.email}</p>
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: "Scheduled for",
    cell: ({ row }) => (
      <div>
        <Badge
          variant={
            row.original.status == "Scheduled"
              ? "default"
              : row.original.status == "Closed"
              ? "success"
              : "destructive"
          }
        >
          {row.original.status}
        </Badge>
        <p>{formatDateTime(row.original.startDate)}</p>
        <p>
          {" "}
          <span className="font-bold">Local Time:</span>{" "}
          {formatTime(row.original.localDate)}
        </p>
      </div>
    ),
  },
  // {
  //   accessorKey: "email",
  //   header: ({ column }) => {
  //     const sorted = column.getIsSorted() === "asc";
  //     return (
  //       <Button variant="ghost" onClick={() => column.toggleSorting(sorted)}>
  //         Email
  //         {sorted ? (
  //           <ChevronsUpDown className="ml-2 h-4 w-4" />
  //         ) : (
  //           <ChevronsUpDown className="ml-2 h-4 w-4" />
  //         )}
  //       </Button>
  //     );
  //   },
  //   cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  // },
  {
    accessorKey: "dob",
    header: "Date of birth",
    cell: ({ row }) => (
      <div>
        <p>
          D.O.B:{" "}
          <span className="text-primary italic font-bold">
            {row.original.lead.dateOfBirth}
          </span>
        </p>
        <p>
          Age:{" "}
          <span className="text-primary italic font-bold">
            {row.original.lead.dateOfBirth
              ? getAge(row.original.lead.dateOfBirth)
              : "N/A"}
          </span>
        </p>
      </div>
    ),
  },
  {
    accessorKey: "comments",
    header: "Comments",
  },

  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => <CellAction appointments={row.original} />,
  },
];
