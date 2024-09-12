"use client";
import { Folder, Mail, MessageSquareMore } from "lucide-react";

import { SmsClient } from "@/components/phone/sms/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmailClient } from "../email/client";

export const CommunicationClient = () => {
  return (
    <Tabs defaultValue="sms" className="flex gap-2 h-full">
      <TabsList
        className="flex flex-col justify-start p-1 gap-2 h-full min-w-[125x]"
        aria-orientation="vertical"
      >
        <TabsTrigger
          className="flex flex-col justify-center gap-2 w-full"
          value="sms"
        >
          <MessageSquareMore size={16} />
          Sms
        </TabsTrigger>
        <TabsTrigger
          className="flex flex-col justify-center gap-2 w-full"
          value="email"
        >
          <Mail size={16} />
          Email
        </TabsTrigger>
        <TabsTrigger
          className="flex flex-col justify-center gap-2 w-full"
          value="documents"
        >
          <Folder size={16} />
          Documents
        </TabsTrigger>
      </TabsList>

      <div className="flex-1 px-2">
        <TabsContent value="sms" className="h-full">
          <SmsClient showHeader={false} />
        </TabsContent>
        <TabsContent value="email">
          <EmailClient />
        </TabsContent>
        <TabsContent value="documents">DOCUMENTS</TabsContent>
      </div>
    </Tabs>
  );
};
