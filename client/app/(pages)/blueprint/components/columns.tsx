"use client";

import { ColumnDef } from "@tanstack/react-table";


import { BluePrint } from "@prisma/client";
import { formatDate } from "@/formulas/dates";
import { Checkbox } from "@/components/ui/checkbox";


export const columns: ColumnDef<BluePrint>[] = [
 

  {
    id: "type",
    accessorKey: "type",
    header: "Type",
    enableGlobalFilter: true,
    enableHiding: true,
  },

  {
    id: "plannedTarget",
    accessorKey: "plannedTarget",
    header: "Planned Target",
    enableGlobalFilter: true,
    enableHiding: true,
  },
  {
    id: "actualTarget",
    accessorKey: "actualTarget",
    header: "Actual Target",
    enableGlobalFilter: true,
    enableHiding: true,
  },
  {
    id: "period",
    accessorKey: "period",
    header: "Period",
    enableGlobalFilter: true,
    enableHiding: true,
  },

  {
    id: "active",
    accessorKey: "active",
    header: "Active",
   
    cell:({row})=>(<Checkbox disabled checked={row.original.active}/>)
  },

  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created At",
    enableHiding: true,
    cell:({row})=>(formatDate(row.original.createdAt))
  },
  {
    id: "endDate",
    accessorKey: "endDate",
    header: "End Date",
    enableHiding: true,
    cell:({row})=>(formatDate(row.original.endDate))
  },

  {
    id: "updatedAt",
    accessorKey: "updatedAt",
    header: "Updated At",
    enableHiding: true,
    cell:({row})=>(formatDate(row.original.updatedAt))
  },
];
