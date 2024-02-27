"use client";

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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralInfoClient } from "../../../../../components/lead/genereal-info";
import { ExtraInfo } from "../../../../../components/lead/extra-info";
import { CallInfo } from "../../../../../components/lead/call-info";
import { Info } from "../../../../../components/lead/info";
import { NotesForm } from "../../../../../components/lead/notes-form";
import { Sms } from "./sms";
import { formatPhoneNumber } from "@/formulas/phones";
import { DropDown } from "../../../../../components/lead/dropdown";
import { CallHistory } from "./call-history/call-history";
import { FullConversation, FullLead } from "@/types";
import { CalendarEvents } from "./calendar-events/calendar-events";
import { ActivityLog } from "./activity-log/activity-log";
import { CardLayout } from "@/components/custom/card-layout";
import { TopMenu } from "./top-menu";
import { PageLayout } from "@/components/custom/page-layout";
import { Body } from "./message-client";

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
            <Info lead={lead} />
          </div>
          <NotesForm leadId={lead.id} intialNotes={lead.notes!} />
          <CallInfo lead={lead} />
        </div>
        <div className="flex justify-around col-span-2">
          <GeneralInfoClient
            lead={lead!}
            call={lead?.calls[lead.calls.length - 1]!}
            appointment={lead?.appointments[lead.appointments.length - 1]!}
            showInfo
          />
          <ExtraInfo lead={lead} />
        </div>
      </div>
      <div className="text-sm font-light px-4">
        <p>Lead Phone Number</p>
        <p>
          -Type: <span className="font-bold">unknown</span>
        </p>
        <p className="flex gap-2">
          <span>
            Caller Id for calls /texts{" "}
            <span className="font-bold">
              {formatPhoneNumber(lead.defaultNumber)}
            </span>
          </span>
          <Pencil className="h-4 w-4 ml-2 text-primary" />
        </p>
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
