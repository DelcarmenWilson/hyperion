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

import { FullConversation } from "@/types";

import LeadCalls from "./lead-calls";
import LeadActivities from "./lead-activities";
import LeadAppointments from "./lead-appointments";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SmsClient } from "@/components/phone/sms/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const LeadTabsClient = ({ leadId }: { leadId: string }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[400px]">
      {/* ACTIVITY */}
      <Tabs
        defaultValue="activity"
        className="pt-2 border border-t-0 border-b-0"
      >
        <div className="w-full text-center">
          {leadId && (
            <TabsList className="w-full flex-wrap justify-evenly h-auto">
              <TabsTrigger
                className="flex flex-col justify-center gap-2"
                value="activity"
              >
                <List size={16} />
                ACTIVITY LOG
              </TabsTrigger>
              <TabsTrigger
                className="flex flex-col justify-center gap-2"
                value="call"
              >
                <PhoneCall size={16} />
                CALL HISTORY
              </TabsTrigger>
              <TabsTrigger
                className="flex flex-col justify-center gap-2"
                value="events"
              >
                <Calendar size={16} />
                CALENDAR EVENTS
              </TabsTrigger>

              <TabsTrigger
                className="flex flex-col justify-center gap-2"
                value="meetings"
              >
                <Video size={16} />
                MEETINGS
              </TabsTrigger>
            </TabsList>
          )}
        </div>

        <ScrollArea className="px-2 h-[400px]">
          <TabsContent value="activity">
            <LeadActivities />
          </TabsContent>
          <TabsContent value="call">
            <LeadCalls leadId={leadId} />
          </TabsContent>
          <TabsContent value="events">
            <LeadAppointments />
          </TabsContent>
          <TabsContent value="meetings">MEETINGS</TabsContent>
        </ScrollArea>
      </Tabs>
      {/* ACTIONS */}
      <Tabs defaultValue="sms" className="pt-2 border border-t-0 border-b-0">
        <div className="w-full text-center">
          {leadId && (
            <TabsList className="w-full flex-wrap justify-evenly h-auto">
              <TabsTrigger
                className="flex flex-col justify-center gap-2"
                value="sms"
              >
                <MessageSquareMore size={16} />
                SMS History
              </TabsTrigger>
              <TabsTrigger
                className="flex flex-col justify-center gap-2"
                value="email"
              >
                <Mail size={16} />
                SEND EMAIL
              </TabsTrigger>
              <TabsTrigger
                className="flex flex-col justify-center gap-2"
                value="documents"
              >
                <Folder size={16} />
                DOCUMENTS
              </TabsTrigger>
            </TabsList>
          )}
        </div>

        <div className="h-[400px] px-2">
          <TabsContent value="sms">
            <SmsClient showHeader={false} />
          </TabsContent>
          <TabsContent value="email">SEND EMAIL</TabsContent>
          <TabsContent value="documents">DOCUMENTS</TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
