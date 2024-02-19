"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

import { AppointmentBox } from "../../../../components/lead/appointment";
import { CallInfo } from "../../../../components/lead/call-info";
import { DropDown } from "../../../../components/lead/dropdown";
import { ExtraInfo } from "../../../../components/lead/extra-info";
import { Info } from "../../../../components/lead/info";
import { NotesForm } from "../../../../components/lead/notes-form";
import { FullLead } from "@/types";

export const columns: ColumnDef<FullLead>[] = [
  {
    id: "select",
    // header: ({ table }) => (
    //   <Checkbox
    //     value="all"
    //     checked={
    //       table.getIsAllPageRowsSelected() ||
    //       (table.getIsSomePageRowsSelected() && "indeterminate")
    //     }
    //     onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //     aria-label="Select all"
    //   />
    // ),
    cell: ({ row }) => (
      <div className="flex flex-col justify-center items-center gap-2">
        {/* <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        /> */}
        <DropDown lead={row.original} />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "lastName",
    header: "",
    cell: ({ row }) => <div />,
  },
  {
    accessorKey: "fullName",
    header: "",
    cell: ({ row }) => <Info lead={row.original} />,
  },
  {
    accessorKey: "notes",
    header: "",
    cell: ({ row }) => (
      <NotesForm leadId={row.original.id} intialNotes={row.original.notes!} />
    ),
  },
  {
    accessorKey: "call",
    header: "",
    cell: ({ row }) => <CallInfo lead={row.original} />,
  },

  {
    accessorKey: "appointment",
    header: "",
    cell: ({ row }) => (
      <AppointmentBox
        lead={row.original}
        call={row.original.calls[row.original.calls.length - 1]!}
        appointment={
          row.original.appointments[row.original.appointments.length - 1]!
        }
      />
    ),
  },
  {
    accessorKey: "extra info",
    header: "",
    cell: ({ row }) => <ExtraInfo lead={row.original} />,
  },
];
