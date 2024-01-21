"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

import { NotesForm } from "./shared/notes-form";
import { Info } from "./shared/info";
import { Call } from "./shared/call";
import { Appointment } from "./shared/appointment";
import ExtraInfo from "./shared/extra-info";

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
    cell: ({ row }) => <Call leadId={row.original.id} />,
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
