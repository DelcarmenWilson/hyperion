"use client";
import { FileImage, MessageCircle, Phone, X } from "lucide-react";

import { TwilioNumber } from "@/types";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import PurchasePhoneNumberDialog from "./purchase-phone-number-dialog";

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
        {row.original.capabilities.MMS ? (
          <FileImage size={16} />
        ) : (
          <X size={16} />
        )}{" "}
      </p>
    ),
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => <PurchasePhoneNumberDialog phoneNumber={row.original} />,
  },
];
