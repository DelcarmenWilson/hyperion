"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { usePhone } from "@/hooks/use-phone";
import socket from "@/lib/socket";
import { CoachNotification } from "./phone/coach-notification";
import { TwilioShortConference } from "@/types/twilio";
import { FullLeadNoConvo } from "@/types";
import { useCurrentRole } from "@/hooks/user-current-role";

export const MainNav = () => {
  const role = useCurrentRole();
  const { onPhoneInOpen, onPhoneOutOpen, conference, setConference } =
    usePhone();

  //COACH NOTIFICATION
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [lead, setLead] = useState<FullLeadNoConvo>();

  const onJoinCall = () => {
    setIsNotificationOpen(false);
    onPhoneOutOpen(lead, conference);
  };

  useEffect(() => {
    if (role != "ADMIN") return;
    socket.on(
      "coach-request-received",
      (lead: FullLeadNoConvo, conference: TwilioShortConference) => {
        setConference(conference);
        setLead(lead);
        setIsNotificationOpen(true);
      }
    );
    return () => {
      socket?.disconnect();
    };
  }, [socket]);

  return (
    <CoachNotification
      conference={conference}
      isOpen={isNotificationOpen}
      onJoinCall={onJoinCall}
      onClose={() => setIsNotificationOpen(false)}
    />
    // <Button onClick={onPhoneInOpen}>Open Modal</Button>
    // <Button onClick={() => setIsNotificationOpen(true)}>
    //   Open Notifications
    // </Button>
  );
};
