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
      <TabsList className="flex flex-col gap-2 h-full w-auto">
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

      <ScrollArea className="flex-1 px-2">
        <TabsContent value="activity">
          <ActivityList />
        </TabsContent>
        <TabsContent value="call">
          <CallHistoryClient />
        </TabsContent>
        <TabsContent value="events">
          <AppointmentClient />
        </TabsContent>
        <TabsContent value="meetings">MEETINGS</TabsContent>
      </ScrollArea>
    </Tabs>
  );
};
