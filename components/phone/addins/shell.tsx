"use client";
import { MessageSquare, Phone, Voicemail } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PhoneOut } from "@/components/phone/phone-out";
import { usePhoneContext } from "@/providers/phone-provider";
import { VoicemailList } from "@/components/phone/voicemail/list";
import { PhoneLeadInfo } from "@/components/phone/addins/lead-info";
import { SmsClient } from "../sms/client";

const PhoneShell = () => {
  const { voicemails } = usePhoneContext();
  return (
    <div className="flex flex-1 border-t">
      <PhoneLeadInfo />
      <Tabs className="w-[400px] h-full border-s" defaultValue="phone">
        <TabsList className="w-full  h-auto">
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
        <TabsContent value="sms">
          <SmsClient />
        </TabsContent>
        <TabsContent value="voicemail">
          <VoicemailList initVoicemails={voicemails} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PhoneShell;
