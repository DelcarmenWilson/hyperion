"use client";
import { FullAppointment } from "@/types";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { formatDateTime, getAge } from "@/formulas/dates";
import { CellDetails } from "./cell-details";

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
    id: "status",
    accessorKey: "status",
    enableGlobalFilter: true,
    enableHiding: true,
  },
  {
    accessorKey: "fullName",
    header: "Appointment with",
    cell: ({ row }) => <CellDetails lead={row.original.lead} />,

    enableGlobalFilter: true,
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
        {row.original.startDate.getTime() !=
          row.original.localDate.getTime() && (
          <p>
            <span className="font-bold">Lead Time:</span>{" "}
            {/* {formatTime(row.original.localDate)} */}
            {/* //TODO - */}
            {formatDateTime(row.original.localDate)}
          </p>
        )}
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
            {row.original.lead.dateOfBirth
              ? new Date(row.original.lead.dateOfBirth!).toLocaleDateString()
              : ""}
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
    cell: ({ row }) => <CellAction appointment={row.original} />,
  },
];
