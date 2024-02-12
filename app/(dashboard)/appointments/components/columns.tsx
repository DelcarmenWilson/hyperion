"use client";
import { format } from "date-fns";
import { getAge } from "@/formulas/dates";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Checkbox } from "@/components/ui/checkbox";
import { formatPhoneNumber } from "@/formulas/phones";
import { Badge } from "@/components/ui/badge";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type AppointmentColumn = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  dob?: Date;
  date: Date;
  status: string;
  comments?: string;
};

export const columns: ColumnDef<AppointmentColumn>[] = [
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
        <p className="capitalize">{row.original.fullName}</p>
        <p className="text-primary italic font-bold">
          {formatPhoneNumber(row.original.phone)}
        </p>
        <p className="lowercase">{row.original.email}</p>
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
          D.O.B:{" "}
          <span className="text-primary italic font-bold">
            {format(row.original.dob!, "MM-dd-yy")}
          </span>
        </p>
        <p>
          Age:{" "}
          <span className="text-primary italic font-bold">
            {getAge(row.original.dob!)}
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
