"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

import { Appointment } from "./shared/appointment";
import { Call } from "./shared/call";
import { DropDown } from "./shared/dropdown";
import { ExtraInfo } from "./shared/extra-info";
import { Info } from "./shared/info";
import { NotesForm } from "./shared/notes-form";

export type LeadColumn = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cellPhone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  conversationId?: string;
  notes: string;
  createdAt: Date;
};

export const columns: ColumnDef<LeadColumn>[] = [
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
    cell: ({ row }) => <Call lead={row.original} />,
  },

  {
    accessorKey: "appointment",
    header: "",
    cell: ({ row }) => <Appointment />,
  },
  {
    accessorKey: "extra info",
    header: "",
    cell: ({ row }) => <ExtraInfo createdAt={row.original.createdAt} />,
  },
];
