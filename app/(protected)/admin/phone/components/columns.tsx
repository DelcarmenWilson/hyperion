"use client";
import { format } from "date-fns";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Checkbox } from "@/components/ui/checkbox";
import { formatPhoneNumber } from "@/formulas/phones";
import { TwilioNumber } from "@/types/twilio";
import { Image, MessageCircle, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<TwilioNumber>[] = [
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
    accessorKey: "friendlyName",
    header: "FriendlyName",
  },
  {
    accessorKey: "locality",
    header: "Locality",
  },
  {
    accessorKey: "region",
    header: "State",
  },
  {
    accessorKey: "voice",
    header: "Voice",
    cell: ({ row }) => (
      <p>
        {row.original.capabilities.voice ? (
          <Phone size={16} />
        ) : (
          <X size={16} />
        )}
      </p>
    ),
  },
  {
    accessorKey: "SMS",
    header: "Sms",
    cell: ({ row }) => (
      <p>
        {row.original.capabilities.SMS ? (
          <MessageCircle size={16} />
        ) : (
          <X size={16} />
        )}{" "}
      </p>
    ),
  },
  {
    accessorKey: "MMS",
    header: "Mms",
    cell: ({ row }) => (
      <p>
        {row.original.capabilities.MMS ? <Image size={16} /> : <X size={16} />}{" "}
      </p>
    ),
  },
  {
    header: "",
    id: "actions",
    cell: ({ row }) => (
      <Button
        onClick={
          row.original.onPurchase
            ? row.original.onPurchase(row.original.phoneNumber)!
            : () => {}
        }
      >
        Details
      </Button>
    ),
  },
];
