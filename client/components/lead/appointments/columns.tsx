"use client";
import { format } from "date-fns";
import { getAge } from "@/formulas/dates";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Checkbox } from "@/components/ui/checkbox";
import { formatPhoneNumber } from "@/formulas/phones";
import { Badge } from "@/components/ui/badge";
import { FullAppointment } from "@/types";
import Link from "next/link";

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
        <p className="capitalize">
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
        <Badge variant="outlineprimary">{row.original.status}</Badge>
        <p className="capitalize">
          {format(row.original.date, "MM-dd hh:mm aaaaa'M'")}
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
          D.O.B:
          <span className="text-primary italic font-bold">
            {row.original.lead.dateOfBirth
              ? format(row.original.lead.dateOfBirth, "MM-dd-yy")
              : "N/A"}
          </span>
        </p>
        <p>
          Age:
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
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
