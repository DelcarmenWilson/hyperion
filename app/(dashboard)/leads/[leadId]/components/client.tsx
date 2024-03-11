"use client";
import { useState } from "react";
import { Pencil } from "lucide-react";

import { toast } from "sonner";

import { FullLead, LeadGeneralInfo, LeadMainInfo, LeadSaleInfo } from "@/types";

import { formatPhoneNumber } from "@/formulas/phones";

import { DropDown } from "@/components/lead/dropdown";
import { Button } from "@/components/ui/button";
import { GeneralInfoClient } from "@/components/lead/general-info";
import { SaleInfoClient } from "@/components/lead/sale-info";
import { CallInfo } from "@/components/lead/call-info";
import { MainInfoClient } from "@/components/lead/main-info";
import { NotesForm } from "@/components/lead/notes-form";

import { PhoneSwitcher } from "@/components/phone/addins/switcher";

import { leadUpdateByIdDefaultNumber } from "@/actions/lead";

type LeadClientProps = {
  lead: FullLead;
};

export const LeadClient = ({ lead }: LeadClientProps) => {
  const [edit, setEdit] = useState(false);
  const [defaultNumber, setDefaultNumber] = useState(lead.defaultNumber);
  const leadMainInfo: LeadMainInfo = {
    id: lead.id,
    firstName: lead.firstName,
    lastName: lead.lastName,
    cellPhone: lead.cellPhone,
    email: lead.email || undefined,
    address: lead.address || undefined,
    city: lead.city || undefined,
    state: lead.state,
    zipCode: lead.zipCode || undefined,
    quote: lead.quote,
    status: lead.status,
  };

  const leadInfo: LeadGeneralInfo = {
    id: lead.id,
    gender: lead.gender,
    maritalStatus: lead.maritalStatus,
    dateOfBirth: lead.dateOfBirth || undefined,
    weight: lead.weight || undefined,
    height: lead.height || undefined,
    income: lead.income || undefined,
    smoker: lead.smoker,
  };

  const leadSale: LeadSaleInfo = {
    id: lead.id,
    createdAt: lead.createdAt,
    vendor: lead.vendor,
    saleAmount: lead.saleAmount,
    commision: lead.commision,
    costOfLead: lead.costOfLead,
  };
  const onSetDefaultNumber = (e: string) => {
    if (e != defaultNumber) {
      setDefaultNumber(e);
      leadUpdateByIdDefaultNumber(lead.id, e).then((data) => {
        if (data.success) {
          toast.success(data.success);
        }
        if (data.error) {
          toast.error(data.error);
        }
      });
    }
    setEdit(false);
  };
  return (
    <>
      {/*DATA  */}
      <div className="grid grid-cols-1 lg:grid-cols-5 ">
        <div className="grid grid-cols-1 lg:grid-cols-3 col-span-3 gap-2">
          <div className="relative">
            <div className="absolute top-0 right-0">
              <DropDown lead={lead} />
            </div>
            <MainInfoClient
              info={leadMainInfo}
              conversationId={lead.conversation?.id as string}
            />
          </div>
          <NotesForm leadId={lead.id} intialNotes={lead.notes!} />
          <CallInfo lead={lead} />
        </div>
        <div className="flex justify-around col-span-2">
          <GeneralInfoClient
            info={leadInfo}
            call={lead?.calls[lead.calls.length - 1]!}
            appointment={lead?.appointments[lead.appointments.length - 1]!}
            showInfo
          />
          <SaleInfoClient info={leadSale} />
        </div>
      </div>
      <div className="text-sm font-light px-4">
        <p>Lead Phone Number</p>
        <p>
          -Type: <span className="font-bold">unknown</span>
        </p>
        <div className="flex items-center gap-2 group">
          <span>Caller Id for calls /texts</span>
          {edit ? (
            <PhoneSwitcher
              number={defaultNumber}
              onSetDefaultNumber={onSetDefaultNumber}
            />
          ) : (
            <>
              <span className="font-bold">
                {formatPhoneNumber(defaultNumber)}
              </span>
              <Button
                className="opacity-0 group-hover:opacity-100"
                variant="link"
                size="sm"
                onClick={() => setEdit(true)}
              >
                <Pencil size={16} />
                {/* <Pencil
                className="h-4 w-4 ml-2 text-primary cursor-pointer opacity-0 group-hover:opacity-100"
                onClick={() => setEdit(true)}
              /> */}
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
};
