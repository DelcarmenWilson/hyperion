"use client";
import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { FullFeedback } from "@/types";

import { FeedbackActions } from "./actions";
import { formatDate } from "@/formulas/dates";

export const columns: ColumnDef<FullFeedback>[] = [
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
      <div className="flex items-center gap-2">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "page",
    header: "Page",
  },
  {
    accessorKey: "headLine",
    header: "Headline",
  },
  {
    accessorKey: "feedback",
    header: "Feedback",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => <p>{row.original.user.firstName}</p>,
  },
  {
    accessorKey: "createdAt",
    header: "CreatedAt",
    cell: ({ row }) => <span>{formatDate(row.original.createdAt)}</span>,
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => (
      // <Button asChild>
      //   <Link href={`/feedback/${row.original.id}`}>Details</Link>
      // </Button>
      <FeedbackActions feedback={row.original} />
    ),
  },
];
