"use client";
import { useEffect } from "react";
import { MessageSquare, Phone, Voicemail } from "lucide-react";
import { usePhoneContext } from "@/providers/phone";
import { useLeadStore } from "@/hooks/lead/use-lead";
import { usePhoneStore } from "@/hooks/use-phone";

import { Badge } from "@/components/ui/badge";
import { PhoneOut } from "@/components/phone/out";
import { SmsClient } from "../sms/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VoicemailList } from "@/components/phone/voicemail/list";

const PhoneShell = () => {
  const { voicemails } = usePhoneContext();
  const { lead } = usePhoneStore();
  const { setLeadId: setLead } = useLeadStore();
  useEffect(() => {
    if (!lead) return;
    setLead(lead.id);
  }, []);
  return (
    <div className="flex flex-1 border-t h-full overflow-hidden">
      <Tabs className="w-[400px] flex flex-col h-full" defaultValue="phone">
        <TabsList className="w-full h-auto bg-primary/25">
          <TabsTrigger
            className="flex-1 flex-col justify-center gap-2"
            value="phone"
          >
            <Phone size={16} />
            PHONE
          </TabsTrigger>
          <TabsTrigger
            className="flex-1 flex-col justify-center gap-1 py-1"
            value="sms"
          >
            <MessageSquare size={16} />
            SMS
          </TabsTrigger>
          <TabsTrigger
            className="flex-1 flex-col justify-center gap-2 relative"
            value="voicemail"
          >
            <Voicemail size={16} />
            VOICEMAIL
            {voicemails && voicemails?.length > 0 && (
              <Badge className="absolute top-0 right-0 rounded-full">
                {voicemails.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <TabsContent
            className="flex flex-col m-0 overflow-hidden data-[state=active]:h-full"
            value="phone"
          >
            <PhoneOut />
          </TabsContent>
          <TabsContent
            className="flex flex-col m-0 overflow-hidden data-[state=active]:h-full"
            value="sms"
          >
            <SmsClient />
          </TabsContent>
          <TabsContent
            className="flex flex-col m-0 overflow-hidden data-[state=active]:h-full"
            value="voicemail"
          >
            <VoicemailList />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default PhoneShell;
