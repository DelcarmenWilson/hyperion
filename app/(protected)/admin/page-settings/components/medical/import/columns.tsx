"use client";

import { ColumnDef } from "@tanstack/react-table";

export type ImportMedicalConditionColumn = {
  name: string;
  description?: string;
};

export const columns: ColumnDef<ImportMedicalConditionColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
];
