"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

import { AppointmentBox } from "./shared/appointment";
import { CallInfo } from "./shared/call-info";
import { DropDown } from "./shared/dropdown";
import { ExtraInfo } from "./shared/extra-info";
import { Info } from "./shared/info";
import { NotesForm } from "./shared/notes-form";
import { FullLead } from "@/types";

export const columns: ColumnDef<FullLead>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        value="all"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col justify-center items-center gap-2">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
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
      <NotesForm leadId={row.original.id} intialNotes={row.original.notes} />
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
        call={row.original.lastCall!}
        appointment={row.original.lastApp!}
      />
    ),
  },
  {
    accessorKey: "extra info",
    header: "",
    cell: ({ row }) => <ExtraInfo createdAt={row.original.createdAt} />,
  },
];
