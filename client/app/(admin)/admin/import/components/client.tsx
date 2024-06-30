"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersBox } from "./users/users-box";
import { ChatSettingsBox } from "./chatsettings/chatsettings-box";
import { PresetsBox } from "./presets/presets-box";
import { SchedulesBox } from "./schedules/schedules";
import { LeadsBox } from "./leads/leads-box";
import { CallsBox } from "./calls/calls-box";
import { AppointmentsBox } from "./appointments/appointments-box";
import { ConversationsBox } from "./conversations/conversations-box";
import { MessagesBox } from "./messages/messages-box";
import { PhoneNumbersBox } from "./phonenumbers/phonenumbers-box";
import { DisasterClient } from "./disaster/disaster-box";
export const ImportClient = () => {
  return (
    <div className="min-h-[400px] w-full">
      <Tabs defaultValue="disaster" className="pt-2">
        <div className="w-full text-center">
          <TabsList className="w-full flex-wrap h-auto">
            <TabsTrigger value="users">USERS</TabsTrigger>
            <TabsTrigger value="chatSettings">CHAT SETTINGS</TabsTrigger>
            <TabsTrigger value="presets">PRESETS</TabsTrigger>
            <TabsTrigger value="schedules">SCHEDULES</TabsTrigger>
            <TabsTrigger value="leads">LEADS</TabsTrigger>
            <TabsTrigger value="calls">CALLS</TabsTrigger>
            <TabsTrigger value="appointments">APPOINTMENTS</TabsTrigger>
            <TabsTrigger value="conversations">CONVERSATIONS</TabsTrigger>
            <TabsTrigger value="messages">MESSAGES</TabsTrigger>
            <TabsTrigger value="phoneNumber">PHONENUMBERS</TabsTrigger>
            <TabsTrigger value="disaster">DISASTER</TabsTrigger>
          </TabsList>
        </div>

        <div className="px-2">
          <TabsContent value="users">
            <UsersBox />
          </TabsContent>
          <TabsContent value="chatSettings">
            <ChatSettingsBox />
          </TabsContent>
          <TabsContent value="presets">
            <PresetsBox />
          </TabsContent>
          <TabsContent value="schedules">
            <SchedulesBox />
          </TabsContent>
          <TabsContent value="leads">
            <LeadsBox />
          </TabsContent>
          <TabsContent value="calls">
            <CallsBox />
          </TabsContent>
          <TabsContent value="appointments">
            <AppointmentsBox />
          </TabsContent>
          <TabsContent value="conversations">
            <ConversationsBox />
          </TabsContent>
          <TabsContent value="messages">
            <MessagesBox />
          </TabsContent>
          <TabsContent value="phoneNumber">
            <PhoneNumbersBox />
          </TabsContent>
          <TabsContent value="disaster">
            <DisasterClient />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
