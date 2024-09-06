"use client";
import { useContext, useEffect, useState } from "react";
import { userEmitter } from "@/lib/event-emmiter";
import Link from "next/link";
import SocketContext from "@/providers/socket";
import { useCurrentUser } from "@/hooks/use-current-user";
import { usePhone } from "@/hooks/use-phone";
import { toast } from "sonner";

import { TwilioShortConference } from "@/types";

import { Button } from "@/components/ui/button";
import { CoachNotification } from "../phone/coach-notification";
import { useGroupMessage } from "@/hooks/use-group-message";
//TODO - dont forget to remove these test actions.
import { callUpdateByIdAppointment } from "@/actions/call";
import { sendAppointmentReminders } from "@/actions/appointment";
import axios from "axios";
import { scheduleLeadsToImport } from "@/actions/facebook/leads";
import { sendTestEmail } from "@/lib/mail";

export const MainNav = () => {
  const { socket } = useContext(SocketContext).SocketState;
  const user = useCurrentUser();
  const { conference, setConference, onPhoneInOpen } = usePhone();

  //COACH NOTIFICATION
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  //GROUP MESSAGE
  const { onOpen } = useGroupMessage();

  const onJoinCall = () => {
    setIsNotificationOpen(false);
    socket?.emit(
      "coach-joined",
      conference?.agentId,
      conference?.conferenceSid,
      user?.id,
      user?.name
    );
  };
  const onRejectCall = (reason: string) => {
    setIsNotificationOpen(false);
    socket?.emit("coach-reject", conference?.agentId, user?.name, reason);
  };

  const onReminders = async () => {
    const reminders = await sendAppointmentReminders();
    if (reminders.success) console.log(reminders);
    else toast.error(reminders.error);
  };

  const onGetFacebookData = async (
    type:
      | "campaigns"
      | "leads"
      | "adSets"
      | "ads"
      | "audiences"
      | "creatives"
      | "adImages"
      | "forms"
      | "import"
  ) => {
    const response = await axios.post(`/api/facebook/${type}`);
    console.log(response.data);
  };

  const onSheduledLeads = async () => {
    const response = await scheduleLeadsToImport(1800);
    if (response.success) toast.success(response.success);
    else toast.error(response.error);
  };
  const onSendEmail = async () => {
    const email = await sendTestEmail(
      "delcarmenwilson@gmail.com",
      "wdelcarmen"
    );
    console.log(email);
    toast.success("Emails will be send");
  };

  useEffect(() => {
    //GROUP MESSAGE
    socket?.on(
      "group-message-received",
      (data: { message: string; username: string }) => {
        onOpen(data.message, data.username);
      }
    );
    //COACHING
    socket?.on(
      "coach-request-received",
      (data: { conference: TwilioShortConference }) => {
        setConference(data.conference);
        setIsNotificationOpen(true);
      }
    );

    socket?.on(
      "coach-reject-received",
      (data: { coachName: string; reason: string }) => {
        toast.error(`${data.coachName} rejected your request.
      ${data.reason}`);
      }
    );
    //LEAD SHARING
    socket?.on(
      "lead-shared-received",
      (data: { agentName: string; leadId: string; leadFirstName: string }) => {
        const { agentName, leadId, leadFirstName } = data;
        const link = <LeadLink leadId={leadId} />;
        const message = (
          <p className="flex flex-col justify-center items-center gap-2 text-center">
            {`${agentName} has shared ${leadFirstName}'s information with you.`}{" "}
            {link}
          </p>
        );
        toast.success(message);
      }
    );
    socket?.on(
      "lead-unshared-received",
      (data: { agentName: string; leadFirstName: string }) => {
        const { agentName, leadFirstName } = data;
        const message = (
          <p className="flex flex-col justify-center items-center gap-2 text-center">
            {`${agentName} has stopped sharing ${leadFirstName}'s information with you.`}
          </p>
        );
        toast.error(message);
      }
    );
    //LEAD TRANSFER
    socket?.on(
      "lead-transfered-received",
      (data: {
        agentName: string;
        leadIds: string[];
        leadFirstName: string;
      }) => {
        const { agentName, leadIds, leadFirstName } = data;
        const link =
          leadIds.length == 1 ? <LeadLink leadId={leadIds[0]} /> : "";
        const message = (
          <p className="flex flex-col justify-center items-center gap-2 text-center">
            {leadIds.length == 1 ? (
              <span>
                {`${agentName} has transfered ${leadFirstName}'s information to you.`}{" "}
                {link}
              </span>
            ) : (
              <span>{`${agentName} has transfered multiple leads to you.`}</span>
            )}
          </p>
        );
        userEmitter.emit("leadTransferedRecieved", leadIds);
        toast.success(message);
      }
    );
    //NEW LEADS
    socket?.on("leads-new", (data: { dt: number }) => {
      console.log("this ran succesfully");
      toast.success(`${data.dt} leads imported!`);
    });

    // eslint-disable-next-line
  }, []);

  return (
    <>
      {/* TODO - dont forget remove these test buttons */}
      {/* <Button onClick={() => onPhoneInOpen()}>OpenModel</Button> */}
      {/* <Button onClick={() => onOpen("Text", "Text")}>Open Group Message</Button> */}

      {/* <Button onClick={onReminders}>Reminders</Button> 
       <Button onClick={() => onGetFacebookData("campaigns")}>Campaings</Button> 
      <Button onClick={() => onGetFacebookData("leads")}>Leads</Button>
      <Button onClick={() => onGetFacebookData("adSets")}>AdSets</Button>
      <Button onClick={() => onGetFacebookData("ads")}>Ads</Button> 
      <Button onClick={() => onGetFacebookData("audiences")}>Audiences</Button>
      <Button onClick={() => onGetFacebookData("creatives")}>Creatives</Button> 
      <Button onClick={() => onGetFacebookData("adImages")}>Ad Images</Button>
      <Button onClick={() => onGetFacebookData("forms")}>Forms</Button>*/}
      {user?.role == "MASTER" && (
        <Button onClick={onSheduledLeads}>Schedule Leads</Button>
      )}

      <Button onClick={onSendEmail}>Send Email</Button>

      <CoachNotification
        conference={conference}
        isOpen={isNotificationOpen}
        onJoinCall={onJoinCall}
        onRejectCall={onRejectCall}
      />
    </>
  );
};

export const LeadLink = ({ leadId }: { leadId: string }) => {
  return (
    <Link className="bg-emerald-700 text-white" href={`/leads/${leadId}`}>
      View Details
    </Link>
  );
};
