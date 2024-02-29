"use client";

import { useState } from "react";
import {
  Calendar,
  Folder,
  List,
  Mail,
  MessageSquareMore,
  Pencil,
  PhoneCall,
  User,
  Video,
} from "lucide-react";

import { toast } from "sonner";

import {
  FullConversation,
  FullLead,
  LeadGeneralInfo,
  LeadMainInfo,
  LeadSaleInfo,
} from "@/types";

import { formatPhoneNumber } from "@/formulas/phones";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropDown } from "@/components/lead/dropdown";
import { Button } from "@/components/ui/button";
import { GeneralInfoClient } from "@/components/lead/general-info";
import { SaleInfoClient } from "@/components/lead/sale-info";
import { CallInfo } from "@/components/lead/call-info";
import { MainInfoClient } from "@/components/lead/main-info";
import { NotesForm } from "@/components/lead/notes-form";
import { Sms } from "./sms";
import { CallHistory } from "./call-history/call-history";

import { CalendarEvents } from "./calendar-events/calendar-events";
import { ActivityLog } from "./activity-log/activity-log";

import { PageLayout } from "@/components/custom/page-layout";
import { TopMenu } from "./top-menu";

import { Body } from "./message-client";
import { PhoneSwitcher } from "./phone-switcher";

import { leadUpdateByIdDefaultNumber } from "@/actions/lead";

type LeadClientProps = {
  lead: FullLead;
  conversation?: FullConversation;
  nextPrev?: { prev: string | null; next: string | null } | null;
};

export const LeadClient = ({
  lead,
  conversation,
  nextPrev,
}: LeadClientProps) => {
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
    quote: lead.quote || undefined,
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
    saleAmount: lead.saleAmount || undefined,
    commision: lead.commision || undefined,
    costOfLead: lead.costOfLead || undefined,
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
    <PageLayout
      icon={User}
      title={`View Lead - ${lead.firstName}`}
      topMenu={<TopMenu nextPrev={nextPrev!} />}
    >
      {/*DATA  */}
      <div className="grid grid-cols-1 lg:grid-cols-5 ">
        <div className="grid grid-cols-1 lg:grid-cols-3 col-span-3 gap-2">
          <div className="relative">
            <div className="absolute top-0 right-0">
              <DropDown lead={lead} />
            </div>
            <MainInfoClient info={leadMainInfo} />
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

      {/* TABS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[400px]">
        {/* ACTIVITY */}
        <Tabs
          defaultValue="activity"
          className="pt-2 border border-t-0 border-b-0"
        >
          <div className="w-full text-center">
            {lead && (
              <TabsList className="w-full flex-wrap justify-evenly h-auto">
                <TabsTrigger
                  className="flex flex-col justify-center gap-2"
                  value="activity"
                >
                  <List className="w-4 h-4" />
                  ACTIVITY LOG
                </TabsTrigger>
                <TabsTrigger
                  className="flex flex-col justify-center gap-2"
                  value="call"
                >
                  <PhoneCall className="w-4 h-4" />
                  CALL HISTORY
                </TabsTrigger>
                <TabsTrigger
                  className="flex flex-col justify-center gap-2"
                  value="events"
                >
                  <Calendar className="w-4 h-4" />
                  CALENDAR EVENTS
                </TabsTrigger>

                <TabsTrigger
                  className="flex flex-col justify-center gap-2"
                  value="meetings"
                >
                  <Video className="w-4 h-4" />
                  MEETINGS
                </TabsTrigger>
              </TabsList>
            )}
          </div>

          <div className="px-2">
            <TabsContent value="activity">
              <ActivityLog activities={lead.activities!} />
            </TabsContent>
            <TabsContent value="call">
              <CallHistory leadId={lead.id} initialCalls={lead.calls!} />
            </TabsContent>
            <TabsContent value="events">
              <CalendarEvents appointments={lead.appointments!} />
            </TabsContent>
            <TabsContent value="meetings">MEETINGS</TabsContent>
          </div>
        </Tabs>
        {/* ACTIONS */}
        <Tabs defaultValue="sms" className="pt-2 border border-t-0 border-b-0">
          <div className="w-full text-center">
            {lead && (
              <TabsList className="w-full flex-wrap justify-evenly h-auto">
                <TabsTrigger
                  className="flex flex-col justify-center gap-2"
                  value="sms"
                >
                  <MessageSquareMore className="w-4 h-4" />
                  SMS History
                </TabsTrigger>
                <TabsTrigger
                  className="flex flex-col justify-center gap-2"
                  value="email"
                >
                  <Mail className="w-4 h-4" />
                  SEND EMAIL
                </TabsTrigger>
                <TabsTrigger
                  className="flex flex-col justify-center gap-2"
                  value="documents"
                >
                  <Folder className="w-4 h-4" />
                  DOCUMENTS
                </TabsTrigger>
              </TabsList>
            )}
          </div>

          <div className="px-2">
            <TabsContent value="sms">
              <Body initialData={conversation!} />
            </TabsContent>
            <TabsContent value="email">SEND EMAIL</TabsContent>
            <TabsContent value="documents">DOCUMENTS</TabsContent>
          </div>
        </Tabs>
      </div>
    </PageLayout>
  );
};
