"use client";
import { ColumnDef } from "@tanstack/react-table";

import { FullLead, FullLeadPolicy } from "@/types";
import { LeadGeneralSchemaType, LeadMainSchemaType } from "@/schemas/lead";

import { CallInfo } from "./info/call";
import { Checkbox } from "@/components/ui/checkbox";

import { GeneralInfoClient } from "./info/general";
import { LeadDropDown } from "@/components/lead/dropdown";
import { PolicyInfoClient } from ".//info/policy-info";
import { MainInfoClient } from "./info/main";
import { NotesForm } from "./info/notes-form";

export const columns: ColumnDef<FullLead>[] = [
  {
    id: "lastName",
    accessorKey: "lastName",
    enableSorting: false,
    enableGlobalFilter: true,
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
      <div className="flex-center gap-2 h-full">
        <Checkbox
          className="absolute top-2 left-2"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
        <LeadDropDown
          lead={row.original}
          conversationId={row.original.conversation?.id}
        />
      </div>
    ),
  },
  {
    id: "firstName",
    accessorKey: "firstName",
    enableGlobalFilter: true,
    enableHiding: true,
  },
  {
    id: "cellPhone",
    accessorKey: "cellPhone",
    enableGlobalFilter: true,
    header: "General Info",
    cell: ({ row }) => {
      const leadMainInfo: LeadMainSchemaType = {
        ...row.original,
        email: row.original.email || undefined,
        address: row.original.address || undefined,
        city: row.original.city || undefined,
        zipCode: row.original.zipCode || undefined,
      };
      return (
        <div className="max-w-[260px]">
          <MainInfoClient
            info={leadMainInfo}
            noConvo={!!row.original.conversation?.id}
            showInfo
          />
        </div>
      );
    },
  },
  {
    id: "statusId",
    accessorKey: "statusId",
    header: "Notes",
    cell: ({ row }) => (
      <div className="max-w-[260px]">
        <NotesForm
          leadId={row.original.id}
          intialNotes={row.original.notes!}
          initSharedUser={row.original.sharedUser}
        />
      </div>
    ),
  },
  {
    id: "vendor",
    accessorKey: "vendor",
    header: "Vendor",
    cell: ({ row }) => <CallInfo info={row.original} />,
  },

  {
    id: "state",
    accessorKey: "state",
    header: "Last Call",
    cell: ({ row }) => {
      const leadInfo: LeadGeneralSchemaType = {
        ...row.original,
        dateOfBirth: row.original.dateOfBirth || undefined,
        weight: row.original.weight || undefined,
        height: row.original.height || undefined,
        income: row.original.income || undefined,
      };
      return (
        <div className="min-w-[180px] max-w-[260px]">
          <GeneralInfoClient
            info={leadInfo}
            leadName={`${row.original.firstName} ${row.original.lastName}`}
            lastCall={row.original.calls[0]?.createdAt}
            nextAppointment={row.original.appointments[0]?.startDate}
          />
        </div>
      );
    },
  },
  {
    id: "email",
    accessorKey: "email",
    enableGlobalFilter: true,
    header: "Policy",
    cell: ({ row }) => {
      const leadPolicy: FullLeadPolicy = {
        ...row.original?.policy,
        leadId: row.original.id,
      };
      const leadName = `${row.original.firstName} ${row.original.lastName}`;
      return (
        <div className="max-w-[260px]">
          <PolicyInfoClient
            leadId={row.original.id}
            leadName={leadName}
            assistant={row.original.assistant}
            info={leadPolicy}
          />
        </div>
      );
    },
  },
];
