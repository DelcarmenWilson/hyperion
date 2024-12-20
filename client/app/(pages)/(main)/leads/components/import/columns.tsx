"use client";

import { formatDate } from "@/formulas/dates";
import { ColumnDef } from "@tanstack/react-table";

export type ImportLeadColumn = {
  id: string;
  fullName: string;
  email: string;
  cellPhone: string;
  dob: Date | null;
  address: string;
  city: string;
  state: string;
  zip: string;
};

export const columns: ColumnDef<ImportLeadColumn>[] = [
  {
    accessorKey: "fullName",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "cellPhone",
    header: "Phone",
  },
  {
    accessorKey: "dob",
    header: "Dob",
    cell: ({ row }) => (
      <div>{row.original.dob ? formatDate(row.original.dob) : "N/A"}</div>
    ),
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "state",
    header: "State",
  },
  {
    accessorKey: "zip",
    header: "Zip",
  },
];
