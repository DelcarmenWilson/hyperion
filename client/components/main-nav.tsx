"use client";
import { useContext, useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { usePhone } from "@/hooks/use-phone";

import { CoachNotification } from "./phone/coach-notification";
import { TwilioShortConference } from "@/types/twilio";
import { FullLeadNoConvo } from "@/types";
import { toast } from "sonner";
import SocketContext from "@/providers/socket";

export const MainNav = () => {
  const { socket } = useContext(SocketContext).SocketState;
  const user = useCurrentUser();
  const { onPhoneInOpen, onPhoneOutOpen, conference, setConference } =
    usePhone();

  //COACH NOTIFICATION
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [lead, setLead] = useState<FullLeadNoConvo>();

  const onJoinCall = () => {
    setIsNotificationOpen(false);
    onPhoneOutOpen(lead, conference);
  };
  const onRejectCall = (reason: string) => {
    setIsNotificationOpen(false);
    socket?.emit("coach-reject", conference?.agentId, user?.name, reason);
  };

  useEffect(() => {
    if (user?.role == "ADMIN") {
      socket?.on(
        "coach-request-received",
        (data: {
          lead: FullLeadNoConvo;
          conference: TwilioShortConference;
        }) => {
          setConference(data.conference);
          setLead(data.lead);
          setIsNotificationOpen(true);
        }
      );
    }
    socket?.on(
      "coach-reject-received",
      (data: { coachName: string; reason: string }) => {
        toast.error(`${data.coachName} rejected your request.
      ${data.reason}`);
      }
    );
    socket?.on("connected", () => {
      console.log("connected");
    });
    // eslint-disable-next-line
  }, []);

  return (
    <CoachNotification
      conference={conference}
      isOpen={isNotificationOpen}
      onJoinCall={onJoinCall}
      onRejectCall={onRejectCall}
    />
    // <Button onClick={onPhoneInOpen}>Open Modal</Button>
    // <Button onClick={() => setIsNotificationOpen(true)}>
    //   Open Notifications
    // </Button>
  );
};
