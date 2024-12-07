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
import { MdDialpad } from "react-icons/md";
import { useLeadCallData } from "@/hooks/lead/use-call";
import CallsList from "./call-list";

const PhoneShell = () => {
  const { voicemails } = usePhoneContext();
  const { lead } = usePhoneStore();
  const { setLeadId: setLead } = useLeadStore();
  const { onInboundCalls, onOutboundCalls, onMissedCalls } = useLeadCallData();
  const { inboundCalls, inboundCallsFetching } = onInboundCalls();
  const { outboundCalls, outboundCallsFetching } = onOutboundCalls();
  const { missedCalls, missedCallsFetching } = onMissedCalls();
  useEffect(() => {
    if (!lead) return;
    setLead(lead.id);
  }, []);
  return (
    <div className="flex flex-1 border-t h-full overflow-hidden">
      <Tabs className="w-[400px] flex flex-col h-full" defaultValue="keypad">
        <TabsList className="w-full h-auto bg-primary/25">
          <TabsTrigger
            className="flex-1 flex-col justify-center gap-2"
            value="keypad"
          >
            <MdDialpad size={16} />
            KEYPAD
          </TabsTrigger>
          <TabsTrigger
            className="flex-1 flex-col justify-center gap-2"
            value="calls"
          >
            <Phone size={16} />
            Calls
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
            value="keypad"
          >
            <PhoneOut />
          </TabsContent>
          <TabsContent
            className="flex flex-col m-0 overflow-hidden data-[state=active]:h-full"
            value="calls"
          >
            <Tabs
              className="flex-1 flex flex-col h-full overflow-hidden"
              defaultValue="inbound"
            >
              <TabsList className="w-full h-auto bg-secondary justify-evenly">
                <TabsTrigger value="inbound">Inbound</TabsTrigger>
                <TabsTrigger value="outbound">Outbound</TabsTrigger>
                <TabsTrigger value="missedcalls">Missed calls</TabsTrigger>
              </TabsList>

              <TabsContent
                className="flex-1 flex flex-col m-0 overflow-hidden data-[state=active]:h-full"
                value="inbound"
              >
                <CallsList
                  calls={inboundCalls || []}
                  loading={inboundCallsFetching}
                />
              </TabsContent>
              <TabsContent
                className="flex flex-col m-0 overflow-hidden data-[state=active]:h-full"
                value="outbound"
              >
                <CallsList
                  calls={outboundCalls || []}
                  loading={outboundCallsFetching}
                />
              </TabsContent>

              <TabsContent
                className="flex flex-col m-0 overflow-hidden data-[state=active]:h-full"
                value="missedcalls"
              >
                <CallsList
                  calls={missedCalls || []}
                  loading={missedCallsFetching}
                />
              </TabsContent>
            </Tabs>
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

// const PhoneShell = () => {
//   const { voicemails } = usePhoneContext();
//   const { lead } = usePhoneStore();
//   const { setLeadId: setLead } = useLeadStore();
//   useEffect(() => {
//     if (!lead) return;
//     setLead(lead.id);
//   }, []);
//   return (
//     <div className="flex flex-1 border-t h-full overflow-hidden">
//       <Tabs className="w-[400px] flex flex-col h-full" defaultValue="phone">
//         <TabsList className="w-full h-auto bg-primary/25">
//           <TabsTrigger
//             className="flex-1 flex-col justify-center gap-2"
//             value="phone"
//           >
//             <Phone size={16} />
//             PHONE
//           </TabsTrigger>
//           <TabsTrigger
//             className="flex-1 flex-col justify-center gap-1 py-1"
//             value="sms"
//           >
//             <MessageSquare size={16} />
//             SMS
//           </TabsTrigger>
//           <TabsTrigger
//             className="flex-1 flex-col justify-center gap-2 relative"
//             value="voicemail"
//           >
//             <Voicemail size={16} />
//             VOICEMAIL
//             {voicemails && voicemails?.length > 0 && (
//               <Badge className="absolute top-0 right-0 rounded-full">
//                 {voicemails.length}
//               </Badge>
//             )}
//           </TabsTrigger>
//         </TabsList>
//         <div className="flex-1 flex flex-col h-full overflow-hidden">
//           <TabsContent
//             className="flex flex-col m-0 overflow-hidden data-[state=active]:h-full"
//             value="phone"
//           >

//             <PhoneOut />
//           </TabsContent>
//           <TabsContent
//             className="flex flex-col m-0 overflow-hidden data-[state=active]:h-full"
//             value="sms"
//           >
//             <SmsClient />
//           </TabsContent>
//           <TabsContent
//             className="flex flex-col m-0 overflow-hidden data-[state=active]:h-full"
//             value="voicemail"
//           >
//             <VoicemailList />
//           </TabsContent>
//         </div>
//       </Tabs>
//     </div>
//   );
// };

export default PhoneShell;
