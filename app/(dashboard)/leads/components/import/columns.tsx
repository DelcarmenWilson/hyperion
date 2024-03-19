"use client";

import { ColumnDef } from "@tanstack/react-table";

export type ImportLeadColumn = {
  id: string;
  fullName: string;
  email: string;
  cellPhone: string;
  dob: string;
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
