"use client";

import { ColumnDef } from "@tanstack/react-table";

import { GeneralInfoClient } from "@/components/lead/general-info";
import { CallInfo } from "@/components/lead/call-info";
import { DropDown } from "@/components/lead/dropdown";
import { SaleInfoClient } from "@/components/lead/sale-info";
import { MainInfoClient } from "@/components/lead/main-info";
import { NotesForm } from "@/components/lead/notes-form";
import { FullLead, LeadGeneralInfo, LeadMainInfo, LeadSaleInfo } from "@/types";

export const columns: ColumnDef<FullLead>[] = [
  {
    id: "select",
    cell: ({ row }) => (
      <div className="flex flex-col justify-center items-center gap-2">
        <DropDown
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
      const leadMainInfo: LeadMainInfo = {
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
          conversationId={row.original.conversation?.id as string}
        />
      );
    },
  },
  {
    accessorKey: "notes",
    header: "",
    cell: ({ row }) => (
      <NotesForm leadId={row.original.id} intialNotes={row.original.notes!} />
    ),
  },
  {
    accessorKey: "call",
    header: "",
    cell: ({ row }) => <CallInfo lead={row.original} />,
  },

  {
    accessorKey: "appointment",
    header: "",
    cell: ({ row }) => {
      const leadInfo: LeadGeneralInfo = {
        id: row.original.id,
        gender: row.original.gender,
        maritalStatus: row.original.maritalStatus,
        dateOfBirth: row.original.dateOfBirth || undefined,
        weight: row.original.weight || undefined,
        height: row.original.height || undefined,
        income: row.original.income || undefined,
        smoker: row.original.smoker,
      };
      return (
        <GeneralInfoClient
          info={leadInfo}
          call={row.original.calls[row.original.calls.length - 1]!}
          appointment={
            row.original.appointments[row.original.appointments.length - 1]!
          }
        />
      );
    },
  },
  {
    accessorKey: "extra info",
    header: "",
    cell: ({ row }) => {
      const leadSale: LeadSaleInfo = {
        id: row.original.id,
        createdAt: row.original.createdAt,
        vendor: row.original.vendor,
        saleAmount: row.original.saleAmount,
        commision: row.original.commision,
        costOfLead: row.original.costOfLead,
      };
      return <SaleInfoClient info={leadSale} />;
    },
  },
];
