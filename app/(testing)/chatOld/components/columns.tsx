"use client";

import { ColumnDef } from "@tanstack/react-table";

export type MessageColumn = {
  id: string;
  role: string;
  content: string;
  createdAt: string;
};

export const columns: ColumnDef<MessageColumn>[] = [
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "content",
    header: "Content",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  
];
