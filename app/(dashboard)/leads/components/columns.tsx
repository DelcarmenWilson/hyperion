"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  CalendarX,
  ChevronsUpDown,
  Copy,
  MessageSquare,
  MessageSquareWarning,
  MoreVertical,
  Pencil,
  Phone,
  Plus,
  XCircle,
} from "lucide-react";
import { formatPhoneNumber } from "@/formulas/phones";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type LeadColumn = {
  id: string;
  fullName: string;
  email: string;
  cellPhone: string;
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
    cell: ({ row }) => (
      <div className="text-sm">
        <p>{row.original.fullName}</p>
        <p className="flex items-center gap-2 text-primary my-2">
          <Link
            className="font-extrabold italic"
            href={`/leads/${row.original.id}`}
          >
            {formatPhoneNumber(row.original.cellPhone)}
          </Link>
          <Button
            variant="ghost"
            onClick={() =>
              navigator.clipboard.writeText(row.original.cellPhone)
            }
          >
            <Copy className="h-4 w-4" />
          </Button>
        </p>
        <p>{row.original.email}</p>
        <p className="flex gap-2  my-2">
          <span>
            Quote: <span className="text-destructive">Not set</span>
          </span>
          <Pencil className="h-4 w-g ml-2" />
        </p>
        <Button variant="outlineprimary" size="xs">
          <MessageSquare className="h-4 w-g mr-2" />
          SEND SMS
        </Button>
      </div>
    ),
  },
  {
    accessorKey: "notes",
    header: "",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <Textarea
          placeholder="Additional notes here"
          value={row.getValue("notes")}
          className="rounded-br-none rounded-bl-none"
          rows={3}
        />
        <Button
          className="rounded-tr-none rounded-tl-none"
          variant="outlineprimary"
        >
          UPDATE NOTES
        </Button>
      </div>
    ),
  },
  {
    accessorKey: "call",
    header: "",
    cell: ({ row }) => (
      <div className=" inline-flex flex-col gap-2">
        <p>Local time : 11:28 am</p>
        <Button className="w-fit" size="sm">
          <Phone className="w-4 h-4 mr-2" />
          CLICK TO CALL
        </Button>

        <Button className="w-fit" size="sm">
          <MoreVertical className="w-4 h-4 mr-2" />
          DISPOSITION
        </Button>
        <Badge className="flex gap-1" variant="outlinedestructive">
          <MessageSquareWarning className="w-4 h-4" />
          <span> No SMS drips</span>
          <XCircle className="w-4 h-4" />
        </Badge>
        <Badge className="flex gap-1" variant="outlinedestructive">
          <MessageSquareWarning className="w-4 h-4" />
          <span> No email drips</span>
          <XCircle className="w-4 h-4" />
        </Badge>
      </div>
    ),
  },

  {
    accessorKey: "appointment",
    header: "",
    cell: ({ row }) => (
      <div className="flex flex-col gap-2 h-full  justify-start">
        <div className="flex gap-1">
          <CalendarX className="h-4 w-4" />
          Appt: on 8-18 4:00 pm
        </div>
        <Badge className="flex gap-1 w-fit">
          Appt Set <XCircle className="h-4 w-4" />
        </Badge>
        <Button className="w-fit" variant="secondary">
          <Plus className="h-4 w-4" />
          NEW FIELD
        </Button>
      </div>
    ),
  },
  {
    accessorKey: "extra info",
    header: "",
    cell: ({ row }) => (
      <div className="flex flex-col gap-2">
        <div>
          <p>Recieved on</p>
          <p>8-18-23 12:07 pm</p>
        </div>
        <span>Manually created</span>
        <p className="flex gap-2">
          <span>
            Sale amount: <span className="text-destructive">Not set</span>
          </span>
          <Pencil className="h-4 w-g ml-2" />
        </p>
        <p className="flex gap-2">
          <span>
            Commision: <span className="text-destructive">Not set</span>
          </span>
          <Pencil className="h-4 w-g ml-2" />
        </p>
        <p className="flex gap-2">
          <span>
            Cost of lead: <span className="text-destructive">Not set</span>
          </span>
          <Pencil className="h-4 w-g ml-2" />
        </p>
      </div>
    ),
  },
];
