"use client";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { CampaignForm } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/formulas/dates";

export const columns: ColumnDef<CampaignForm>[] = [
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
    accessorKey: "name",
    header: "name",
  },

  {
    accessorKey: "block_display_for_non_targeted_viewer",
    header: "block_display_for_non_targeted_viewer",
  },
  {
    accessorKey: "allow_organic_lead",
    header: "allow_organic_lead",
  },
  {
    accessorKey: "expired_leads_count",
    header: "expired_leads_count",
  },

  {
    accessorKey: "follow_up_action_url",
    header: "follow_up_action_url",
  },
  {
    accessorKey: "leads_count",
    header: "leads_count",
  },
  {
    accessorKey: "follow_up_action_url",
    header: "follow_up_action_url",
  },
  {
    accessorKey: "privacy_policy_url",
    header: "question_page_custom_headline",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <span className="text-primary italic font-bold">
        {formatDate(row.original.created_at)}
      </span>
    ),
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => (
      <Button size="sm" asChild>
        <Link href={`/admin/tasks/${row.original.id}`}>Details</Link>
      </Button>
    ),
  },
];
