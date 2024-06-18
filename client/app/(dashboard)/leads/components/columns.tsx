"use client";

import { ColumnDef } from "@tanstack/react-table";

import { FullLead } from "@/types";
import {
  LeadGeneralSchemaType,
  LeadMainSchemaType,
  LeadPolicySchemaType,
} from "@/schemas/lead";

import { GeneralInfoClient } from "@/components/lead/general-info";
import { CallInfo } from "@/components/lead/call-info";
import { LeadDropDown } from "@/components/lead/dropdown";
import { PolicyInfoClient } from "@/components/lead/policy-info";
import { MainInfoClient } from "@/components/lead/main-info";
import { NotesForm } from "@/components/lead/forms/notes-form";

export const columns: ColumnDef<FullLead>[] = [
  {
    id: "select",
    cell: ({ row }) => (
      <div className="flex flex-col justify-center items-center gap-2">
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
    header: "",
    cell: ({ row }) => {
      const leadMainInfo: LeadMainSchemaType = {
        id: row.original.id,
        firstName: row.original.firstName,
        lastName: row.original.lastName,
        cellPhone: row.original.cellPhone,
        email: row.original.email || undefined,
        address: row.original.address || undefined,
        city: row.original.city || undefined,
        state: row.original.state,
        zipCode: row.original.zipCode || undefined,
        status: row.original.status,
        quote: row.original.quote,
      };
      return (
        <MainInfoClient
          info={leadMainInfo}
          noConvo={!!row.original.conversation?.id}
          showInfo
        />
      );
    },
  },
  {
    accessorKey: "notes",
    header: "",
    cell: ({ row }) => (
      <NotesForm
        leadId={row.original.id}
        intialNotes={row.original.notes!}
        initSharedUser={row.original.sharedUser}
      />
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
        id: row.original.id,
        gender: row.original.gender,
        maritalStatus: row.original.maritalStatus,
        dateOfBirth: row.original.dateOfBirth || undefined,
        weight: row.original.weight || undefined,
        height: row.original.height || undefined,
        income: row.original.income || undefined,
        smoker: row.original.smoker,

        leadName: `${row.original.firstName} ${row.original.lastName}`,
        lastCall: row.original.calls[0]?.createdAt,
        nextAppointment: row.original.appointments[0]?.startDate,
      };
      return <GeneralInfoClient info={leadInfo} />;
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
        createdAt: row.original.createdAt,
        updatedAt: row.original.policy?.updatedAt!,
      };
      const leadName = `${row.original.firstName} ${row.original.lastName}`;
      return (
        <PolicyInfoClient
          leadId={row.original.id}
          leadName={leadName}
          assistant={row.original.assistant}
          info={leadPolicy}
        />
      );
    },
  },
];
