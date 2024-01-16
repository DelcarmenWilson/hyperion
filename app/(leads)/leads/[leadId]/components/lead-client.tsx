"use client";
import moment from "moment";
import { Lead } from "@prisma/client";
import { Message } from "@prisma/client";
import { LeadForm } from "./lead-form";
import { MessageClient } from "./message-client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { sendIntialSms } from "@/actions/sms";
import { toast } from "sonner";
interface LeadClientProps {
  lead: Lead | null;
  initialMessages: Message[];
  userName: string;
  leadName: string;
}
export const LeadClient = ({
  lead,
  initialMessages,
  userName,
  leadName,
}: LeadClientProps) => {
  // const [messages, setMessages] = useState(second)
  const router = useRouter();
  const title = lead ? `${lead.firstName} ${lead.lastName}` : "New Lead";
  const getAge = (dateOfBirth: any): number =>
    moment().diff(dateOfBirth, "years");

  const onStartConversation = async () => {
    if (!lead) return;

    await sendIntialSms(lead.id).then((data) => {
      router.refresh();
      if (data?.error) {
        toast.error(data.error);
      }
      if (data?.success) {
        toast.error(data.success);
      }
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center py-2">
        <Button onClick={() => router.push("/leads")}>
          <ArrowLeftIcon className="h-6 w-6" />
        </Button>
        <h2 className="font-semibold text-2xl text-center">
          {title}
          <span className="text-md italic text-muted-foreground">
            {" "}
            - {lead?.maritalStatus} - {getAge(lead?.dateOfBirth!)}
          </span>
        </h2>
        <div className="flex gap-2">
          {!initialMessages.length && (
            <Button variant="outline" onClick={onStartConversation}>
              Start Conversation
            </Button>
          )}
          {lead && <Button>call</Button>}
        </div>
      </div>
      <Separator />
      <Tabs defaultValue="personal" className="pt-2">
        <div className="w-full text-center">
          {lead && (
            <TabsList className="">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="medical">Medical</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>
          )}
        </div>
        <TabsContent value="personal">
          <LeadForm initialData={lead} />
        </TabsContent>
        <TabsContent value="medical">Change your password here.</TabsContent>
        <TabsContent value="messages">
          <MessageClient
            initialData={initialMessages}
            userName={userName}
            leadName={leadName}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
