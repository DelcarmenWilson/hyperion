"use client";

import { Calendar, List, PhoneCall, Video } from "lucide-react";

import { AppointmentClient } from "../appointment/client";
import { ActivityList } from "./list";
import { CallHistoryClient } from "../call-history/client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ActivityClient = () => {
  return (
    <Tabs defaultValue="activity" className="flex gap-2 h-full">
      <TabsList
        className="flex flex-col justify-start p-1 gap-2 h-full min-w-[125px] "
        aria-orientation="vertical"
      >
        <TabsTrigger
          className="flex flex-col justify-center gap-2 w-full"
          value="activity"
        >
          <List size={16} />
          Activity log
        </TabsTrigger>
        <TabsTrigger
          className="flex flex-col justify-center gap-2 w-full"
          value="call"
        >
          <PhoneCall size={16} />
          Call History
        </TabsTrigger>
        <TabsTrigger
          className="flex flex-col justify-center gap-2 w-full"
          value="appointments"
        >
          <Calendar size={16} />
          Appointments
        </TabsTrigger>

        <TabsTrigger
          className="flex flex-col justify-center gap-2 w-full"
          value="meetings"
        >
          <Video size={16} />
          Meetings
        </TabsTrigger>
      </TabsList>

      <ScrollArea className="flex-1 px-2">
        <TabsContent value="activity">
          <ActivityList />
        </TabsContent>
        <TabsContent value="call">
          <CallHistoryClient />
        </TabsContent>
        <TabsContent value="appointments">
          <AppointmentClient />
        </TabsContent>
        <TabsContent value="meetings">MEETINGS</TabsContent>
      </ScrollArea>
    </Tabs>
  );
};
