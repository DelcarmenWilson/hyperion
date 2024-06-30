"use client";
import { useContext, useEffect, useState } from "react";
import { userEmitter } from "@/lib/event-emmiter";
import Link from "next/link";
import SocketContext from "@/providers/socket";
import { useCurrentUser } from "@/hooks/use-current-user";
import { usePhone } from "@/hooks/use-phone";
import { toast } from "sonner";

import { CoachNotification } from "../phone/coach-notification";
import { TwilioShortConference } from "@/types";
import { leadGetById } from "@/actions/lead";

export const MainNav = () => {
  const { socket } = useContext(SocketContext).SocketState;
  const user = useCurrentUser();
  const { conference, setConference } = usePhone();

  //COACH NOTIFICATION
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

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

  useEffect(() => {
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
      (data: { agentName: string; leadId: string; leadFirstName: string }) => {
        const { agentName, leadId, leadFirstName } = data;
        const link = <LeadLink leadId={leadId} />;
        const message = (
          <p className="flex flex-col justify-center items-center gap-2 text-center">
            {`${agentName} has transfered ${leadFirstName}'s information to you.`}{" "}
            {link}
          </p>
        );
        userEmitter.emit("leadTransferedRecieved", leadId);
        toast.success(message);
      }
    );
    // eslint-disable-next-line
  }, []);

  return (
    <CoachNotification
      conference={conference}
      isOpen={isNotificationOpen}
      onJoinCall={onJoinCall}
      onRejectCall={onRejectCall}
    />
  );
};

export const LeadLink = ({ leadId }: { leadId: string }) => {
  return (
    <Link className="bg-emerald-700 text-white" href={`/leads/${leadId}`}>
      View Details
    </Link>
  );
};
