"use client";

import {
  Calendar,
  Folder,
  List,
  Mail,
  MessageSquareMore,
  PhoneCall,
  Video,
} from "lucide-react";

import { FullConversation, FullLead } from "@/types";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { CallHistoryClient } from "./call-history/client";

import { CalendarEvents } from "./calendar-events/calendar-events";
import { ActivityList } from "./activity-log/list";

import { Body } from "./message-client";
import { ScrollArea } from "@/components/ui/scroll-area";

type LeadTabsClientProps = {
  lead: FullLead;
  conversation?: FullConversation;
};

export const LeadTabsClient = ({ lead, conversation }: LeadTabsClientProps) => {
  return (
    <>
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

          <ScrollArea className="px-2 h-[400px]">
            <TabsContent value="activity">
              <ActivityList initActivities={lead.activities!} />
            </TabsContent>
            <TabsContent value="call">
              <CallHistoryClient leadId={lead.id} initialCalls={lead.calls!} />
            </TabsContent>
            <TabsContent value="events">
              <CalendarEvents appointments={lead.appointments!} />
            </TabsContent>
            <TabsContent value="meetings">MEETINGS</TabsContent>
          </ScrollArea>
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
    </>
  );
};
