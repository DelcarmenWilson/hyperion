"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import SocketContext from "@/providers/socket";
import { useCurrentUser } from "@/hooks/use-current-user";
import { usePhone } from "@/hooks/use-phone";
import { toast } from "sonner";

import { CoachNotification } from "./phone/coach-notification";
import { TwilioShortConference } from "@/types";
import { Button } from "./ui/button";
import { Play } from "lucide-react";

export const MainNav = () => {
  const { socket } = useContext(SocketContext).SocketState;
  const user = useCurrentUser();
  const { onPhoneInOpen, conference, setConference } = usePhone();
  const audioRef = useRef<HTMLAudioElement>(null);
  const onPlay = () => {
    if (!audioRef.current) return;
    audioRef.current.play();
  };

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
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    pusherClient.subscribe(user?.id as string);
    pusherClient.bind("message:notify", onPlay);
    return () => {
      pusherClient.unsubscribe(user?.id as string);
      pusherClient.unbind("message:notify", onPlay);
    };
  }, [user?.id]);

  return (
    <>
      <CoachNotification
        conference={conference}
        isOpen={isNotificationOpen}
        onJoinCall={onJoinCall}
        onRejectCall={onRejectCall}
      />

      <div>
        <audio
          ref={audioRef}
          src={`/sounds/${user?.messageNotification}.wav`}
        />
        {/* <Button onClick={onPlay} type="button">
          <Play size={16} />
        </Button> */}
      </div>
      {/* <Button onClick={onPhoneInOpen}>Open Modal</Button>
      <Button onClick={() => setIsNotificationOpen(true)}>
        Open Notifications
      </Button> */}
    </>
  );
};
