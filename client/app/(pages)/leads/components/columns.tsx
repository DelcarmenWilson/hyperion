"use client";

import { ColumnDef } from "@tanstack/react-table";

import { FullLead } from "@/types";
import {
  LeadGeneralSchemaType,
  LeadMainSchemaType,
  LeadPolicySchemaType,
} from "@/schemas/lead";

import { CallInfo } from "./info/call";
import { Checkbox } from "@/components/ui/checkbox";

import { LeadDropDown } from "./info/dropdown";
import { GeneralInfoClient } from "./info/general";
import { PolicyInfoClient } from ".//info/policy-info";
import { MainInfoClient } from "./info/main";
import { NotesForm } from "./info/notes-form";

export const columns: ColumnDef<FullLead>[] = [
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
      <div className="flex-center gap-2 h-full">
        <Checkbox
          className="absolute top-2 left-2"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
        <LeadDropDown
          lead={row.original}
          conversation={row.original.conversation!}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "firstName",
    accessorKey: "firstName",
    enableGlobalFilter: true,
    enableHiding: true,
  },
  {
    id: "lastName",
    accessorKey: "lastName",
    enableGlobalFilter: true,
    enableHiding: true,
  },
  {
    id: "cellPhone",
    accessorKey: "cellPhone",
    enableGlobalFilter: true,
    enableHiding: true,
  },
  {
    id: "email",
    accessorKey: "email",
    enableGlobalFilter: true,
    enableHiding: true,
  },
  {
    id: "status",
    accessorKey: "status",
    enableHiding: true,
  },
  {
    id: "vendor",
    accessorKey: "vendor",
    enableHiding: true,
  },
  {
    id: "state",
    accessorKey: "state",
    enableHiding: true,
  },
  {
    accessorKey: "mainInfo",
    header: "Info",
    cell: ({ row }) => {
      const leadMainInfo: LeadMainSchemaType = {
        ...row.original,
        email: row.original.email || undefined,
        address: row.original.address || undefined,
        city: row.original.city || undefined,
        zipCode: row.original.zipCode || undefined,
        textCode: row.original.textCode!,
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
    accessorKey: "notes",
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
    accessorKey: "call",
    header: "",
    cell: ({ row }) => <CallInfo info={row.original} />,
  },

  {
    accessorKey: "appointment",
    header: "",
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
    accessorKey: "extra info",
    header: "",
    cell: ({ row }) => {
      const leadPolicy: LeadPolicySchemaType = {
        leadId: row.original.id,
        ap: row.original.policy?.ap!,
        carrier: row.original.policy?.carrier!,
        policyNumber: row.original.policy?.policyNumber!,
        status: row.original.policy?.status!,
        commision: row.original.policy?.commision!,
        coverageAmount: row.original.policy?.coverageAmount!,
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
