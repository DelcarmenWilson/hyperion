"use client";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";

import { Call, Lead } from "@prisma/client";

import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Folder,
  List,
  Mail,
  MessageSquareMore,
  Pencil,
  PhoneCall,
  User,
  Video,
} from "lucide-react";

import { Card, CardContent, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentBox } from "../../components/shared/appointment";
import { ExtraInfo } from "../../components/shared/extra-info";
import { CallInfo } from "../../components/shared/call-info";
import { Info } from "../../components/shared/info";
import { NotesForm } from "../../components/shared/notes-form";
import { Sms } from "./sms";
import { formatPhoneNumber } from "@/formulas/phones";
import { DropDown } from "../../components/shared/dropdown";
import { CallHistory } from "./callhistory/call-history";
import { FullLead } from "@/types";

interface LeadClientProps {
  lead: FullLead;
  nextPrev: any;
}
export const LeadClient = ({ lead, nextPrev }: LeadClientProps) => {
  const user = useCurrentUser();
  const router = useRouter();

  return (
    <Card className="flex flex-col relative w-full">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-accent p-4 rounded-br-lg">
            <User className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className=" text-sm text-muted-foreground">
            View Lead
          </CardTitle>
        </div>
        <div className="flex gap-2 mr-6">
          <Button
            variant="outlineprimary"
            size="sm"
            onClick={() => router.push("/leads")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            GO BACK
          </Button>
          <Button
            disabled={!nextPrev.prev}
            size="sm"
            onClick={() => router.push(`/leads/${nextPrev.prev}`)}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            PREV LEAD
          </Button>
          <Button
            disabled={!nextPrev.next}
            size="sm"
            onClick={() => router.push(`/leads/${nextPrev.next}`)}
          >
            NEXT LEAD
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
      <Separator />
      <CardContent className="flex-1 items-center space-y-0 gap-2 py-2">
        {/*DATA  */}
        <div className="grid grid-cols-5">
          <div className="grid grid-cols-3 col-span-3 gap-2">
            <div className="relative">
              <div className="absolute top-0 right-0">
                <DropDown lead={lead} />
              </div>
              <Info lead={lead} />
            </div>
            <NotesForm leadId={lead.id} intialNotes={lead.notes!} />
            <CallInfo lead={lead} />
          </div>
          <div className="flex justify-around col-span-2">
            <AppointmentBox
              call={lead.lastCall!}
              appointment={lead.lastApp!}
              showInfo
            />
            <ExtraInfo createdAt={lead.createdAt} />
          </div>
        </div>
        <div className="text-sm font-light px-4">
          <p>Lead Phone Number</p>
          <p>
            -Type: <span className="font-bold">unknown</span>
          </p>
          <p className="flex gap-2">
            <span>
              Caller Id for calls /texts{" "}
              <span className="font-bold">
                {formatPhoneNumber(lead.defaultNumber)}
              </span>
            </span>
            <Pencil className="h-4 w-4 ml-2 text-primary" />
          </p>
        </div>

        {/* TABS */}
        <div className="grid grid-cols-2 gap-4 min-h-[400px]">
          {/* ACTIVITY */}
          <Tabs
            defaultValue="activity"
            className="pt-2 border border-t-0 border-b-0"
          >
            <div className="w-full text-center">
              {lead && (
                <TabsList className="w-full justify-evenly h-auto">
                  <TabsTrigger
                    className="flex flex-col justify-center gap-2"
                    value="activity"
                  >
                    <List className="w-4 h-4" />
                    ACTIVITY LOG
                  </TabsTrigger>
                  <TabsTrigger
                    className="flex flex-col justify-center gap-2"
                    value="call"
                  >
                    <PhoneCall className="w-4 h-4" />
                    CALL HISTORY
                  </TabsTrigger>
                  <TabsTrigger
                    className="flex flex-col justify-center gap-2"
                    value="events"
                  >
                    <Calendar className="w-4 h-4" />
                    CALENDAR EVENTS
                  </TabsTrigger>

                  <TabsTrigger
                    className="flex flex-col justify-center gap-2"
                    value="meetings"
                  >
                    <Video className="w-4 h-4" />
                    MEETINGS
                  </TabsTrigger>
                </TabsList>
              )}
            </div>

            <div className="px-2">
              <TabsContent value="activity">ACTIVITY LOG</TabsContent>
              <TabsContent value="call">
                <CallHistory initialCalls={lead.calls!} />
              </TabsContent>
              <TabsContent value="events">CALENDAR EVENTS</TabsContent>
              <TabsContent value="meetings">MEETINGS</TabsContent>
            </div>
          </Tabs>
          {/* ACTIONS */}
          <Tabs
            defaultValue="sms"
            className="pt-2 border border-t-0 border-b-0"
          >
            <div className="w-full text-center">
              {lead && (
                <TabsList className="w-full justify-evenly h-auto">
                  <TabsTrigger
                    className="flex flex-col justify-center gap-2"
                    value="sms"
                  >
                    <MessageSquareMore className="w-4 h-4" />
                    SMS History
                  </TabsTrigger>
                  <TabsTrigger
                    className="flex flex-col justify-center gap-2"
                    value="email"
                  >
                    <Mail className="w-4 h-4" />
                    SEND EMAIL
                  </TabsTrigger>
                  <TabsTrigger
                    className="flex flex-col justify-center gap-2"
                    value="documents"
                  >
                    <Folder className="w-4 h-4" />
                    DOCUMENTS
                  </TabsTrigger>
                </TabsList>
              )}
            </div>

            <div className="px-2">
              <TabsContent value="sms">
                <Sms />
              </TabsContent>
              <TabsContent value="email">SEND EMAIL</TabsContent>
              <TabsContent value="documents">DOCUMENTS</TabsContent>
            </div>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};
