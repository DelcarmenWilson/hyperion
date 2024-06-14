"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "../purchasenumbers/cell-action";
import { Checkbox } from "@/components/ui/checkbox";
import { formatPhoneNumber } from "@/formulas/phones";
import { FullPhoneNumber } from "@/types";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AssignNumberForm } from "../unassigednumbers/form";
import { formatDate } from "@/formulas/dates";

export const columns: ColumnDef<FullPhoneNumber>[] = [
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
    accessorKey: "firstName",
    header: "Agent",
    cell: ({ row }) => (
      <span>{`${row.original.agent?.firstName} ${row.original.agent?.lastName}`}</span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone number",
    cell: ({ row }) => <span>{formatPhoneNumber(row.original.phone)}</span>,
  },
  {
    accessorKey: "state",
    header: "State",
  },
  {
    accessorKey: "renewAt",
    header: "Renew date",
    cell: ({ row }) => <span>{formatDate(row.original.renewAt)}</span>,
  },
  {
    accessorKey: "createdAt",
    header: "Create At",
    cell: ({ row }) => <span>{formatDate(row.original.createdAt)}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",

    cell: ({ row }) => (
      <div>
        {row.original.status}
        {row.original.status === "Inactive" &&
          ` since ${formatDate(row.original.updatedAt)}`}
      </div>
    ),
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => (
      <>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">Assign</Button>
          </DialogTrigger>
          <DialogContent className="p-0 max-h-[96%] max-w-[500px]">
            <AssignNumberForm phoneNumber={row.original} />
          </DialogContent>
        </Dialog>
      </>
    ),
  },
];
