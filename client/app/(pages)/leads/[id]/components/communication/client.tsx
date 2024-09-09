"use client";
import { Folder, Mail, MessageSquareMore } from "lucide-react";

import { SmsClient } from "@/components/phone/sms/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const CommunicationClient = () => {
  return (
    <Tabs defaultValue="sms" className="flex gap-2 h-full">
      <TabsList className="flex flex-col gap-2 h-full w-auto">
        <TabsTrigger className="flex flex-col justify-center gap-2" value="sms">
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

      <div className="flex-1 px-2">
        <TabsContent value="sms">
          <SmsClient showHeader={false} />
          {/* <Body initialData={conversation!} /> */}
        </TabsContent>
        <TabsContent value="email">SEND EMAIL</TabsContent>
        <TabsContent value="documents">DOCUMENTS</TabsContent>
      </div>
    </Tabs>
  );
};
