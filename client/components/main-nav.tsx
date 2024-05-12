"use client";
import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/use-socket";
import { useCurrentUser } from "@/hooks/use-current-user";
import { usePhone } from "@/hooks/use-phone";

import { CoachNotification } from "./phone/coach-notification";
import { TwilioShortConference } from "@/types/twilio";
import { FullLeadNoConvo } from "@/types";
import { toast } from "sonner";

export const MainNav = () => {
  const socket = useSocket();
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
    socket?.emit("coach-reject", user?.name, reason);
  };

  useEffect(() => {
    if (user?.role == "ADMIN") {
      socket?.on(
        "coach-request-received",
        (lead: FullLeadNoConvo, conference: TwilioShortConference) => {
          setConference(conference);
          setLead(lead);
          setIsNotificationOpen(true);
        }
      );
    }
    socket?.on("coach-reject-recieved", (coachName: string, reason: string) => {
      toast.error(`${coachName} rejected your request.
      ${reason}`);
    });
    socket?.on("connected", () => {
      console.log("connected");
    });
  }, [socket]);

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
