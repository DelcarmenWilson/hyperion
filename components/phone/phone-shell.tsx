"use client";
import { MessageSquare, Phone, Voicemail } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PhoneOut } from "@/components/phone/phone-out";
import { usePhoneContext } from "@/providers/phone-provider";
import { VoicemailOut } from "@/components/phone/voicemail-out";
import { Badge } from "@/components/ui/badge";
import { PhoneLeadInfo } from "@/components/phone/phone-lead-info";

const PhoneShell = () => {
  const { voicemails } = usePhoneContext();
  return (
    <div className="flex w-full justify-end h-full">
      <PhoneLeadInfo />
      <Tabs className="w-[400px] border-s" defaultValue="phone">
        <TabsList className="w-full  h-auto">
          <TabsTrigger
            className="flex-1 flex-col justify-center gap-2"
            value="phone"
          >
            <Phone className="w-4 h-4" />
            PHONE
          </TabsTrigger>
          <TabsTrigger
            className="flex-1 flex-col justify-center gap-1 py-1"
            value="sms"
          >
            <MessageSquare className="w-4 h-4" />
            SMS
          </TabsTrigger>
          <TabsTrigger
            className="flex-1 flex-col justify-center gap-2 relative"
            value="voicemail"
          >
            <Voicemail className="w-4 h-4" />
            VOICEMAIL
            {/* {voicemails?.length && (
                  <Badge className="absolute top-0 right-0 rounded-full">
                    {voicemails.length}
                  </Badge>
                )} */}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="phone">
          <PhoneOut />
        </TabsContent>
        <TabsContent value="sms">SMS (Future Update)</TabsContent>
        <TabsContent value="voicemail">
          <VoicemailOut voicemails={voicemails} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PhoneShell;
