import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { userEmitter } from "@/lib/event-emmiter";
import axios from "axios";
import { toast } from "sonner";
import SocketContext from "@/providers/socket";
import { useGroupMessageStore } from "@/hooks/chat/use-group-message";
import { usePhoneStore } from "@/hooks/use-phone";
import { useCurrentUser } from "@/hooks/user/use-current";
import { useMiniMessageStore } from "@/hooks/chat/use-mini-message";
import { useSocketStore } from "@/hooks/use-socket-store";
import { useChatStore } from "@/hooks/chat/use-chat";
import { usePathname } from "next/navigation";
import { useInvalidate } from "@/hooks/use-invalidate";
import { signOut } from "next-auth/react";

import Link from "next/link";
import { FullChatMessage, TwilioShortConference } from "@/types";

import { sendTestEmail } from "@/lib/mail";

//TODO - dont forget to remove these test actions.
import { sendAppointmentReminders } from "@/actions/appointment";
import { scheduleLeadsToImport } from "@/actions/facebook/leads";
import { chatUpdateByIdUnread } from "@/actions/chat";
import { useTodoStore } from "@/hooks/user/use-todo";

export const useMainNav = () => {
  const { socket } = useContext(SocketContext).SocketState;

  const user = useCurrentUser();
  //COACH NOTIFICATION
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const { conference, setConference, onPhoneInOpen } = usePhoneStore();
  const { onOpen } = useGroupMessageStore();

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

  return {
    user,
    isNotificationOpen,
    onSheduledLeads,
    onSendEmail,
    conference,
    onJoinCall,
    onRejectCall,
  };
};

export const useMainChatActions = () => {
  const { socket } = useSocketStore();
  const { chatId, isChatOpen } = useChatStore();
  const { isMiniMessageOpen, onMiniMessageOpen } = useMiniMessageStore();
  const { onTodoNotificationOpen } = useTodoStore();
  const { invalidate } = useInvalidate();
  const audioRef = useRef<HTMLAudioElement>(null);

  const pathname = usePathname();

  const invalidateNav = () => {
    invalidate("navbar-chats");
  };

  // GENERAL FUNCTIONS
  const onPlay = () => {
    if (!audioRef.current) return;
    audioRef.current.volume = 0.5;
    audioRef.current.play();
  };

  const onRecievedChatAction = useCallback(
    (mChatId: string, action: string) => {
      if (mChatId != chatId) return;
      switch (action) {
        case "res":
          break;
        default:
          invalidate(`chat-${chatId}`);
          toast.success("Chat has been deleted");
          break;
      }
    },
    [chatId]
  );

  const onMessageRecieved = useCallback(
    (mChatId: string, mid: string) => {
      if (mChatId == chatId) {
        chatUpdateByIdUnread(chatId);
        invalidate(`chat-${chatId}`);
      }

      if (pathname.startsWith("/chat")) return;
      if (!isChatOpen && !isMiniMessageOpen) onMiniMessageOpen(mid);

      invalidate("navbar-chats");
      onPlay();
    },
    [chatId, isChatOpen, isMiniMessageOpen]
  );

  const onAccountSuspended = () => {
    toast.error("You account has been supsended");
    signOut();
  };

  const onTodoReminder = (todoId: string) => {
    onTodoNotificationOpen(todoId);
    onPlay();
  };

  useEffect(() => {
    socket?.on(
      "chat-message-received",
      (data: { message: FullChatMessage }) => {
        onMessageRecieved(data.message.chatId, data.message.id);
      }
    );
    socket?.on(
      "chat-action-received",
      (data: { chatId: string; action: string }) =>
        onRecievedChatAction(data.chatId, data.action)
    );
    socket?.on("account-suspended-recieved", () => onAccountSuspended());
    socket?.on("todo-reminder-recieved", (data: { dt: string }) =>
      onTodoReminder(data.dt)
    );
    return () => {
      socket?.off("chat-message-received");
      socket?.off("chat-action-received");
      socket?.off("account-suspended-recieved");
      socket?.off("todo-reminder-recieved");
    };
  }, [socket, onMessageRecieved, onRecievedChatAction, onTodoReminder]);

  //   //TODO we can posibly consolidate the next two socket calls
  //   socket?.on("chat-message-received", (data: { message: FullChatMessage }) =>
  //     onMessageRecieved(
  //       chatId as string,
  //       data.message.chatId,
  //       data.message.id,
  //       isChatOpen && isOpen
  //     )
  //   );
  //   socket?.on(
  //     "chat-action-received",
  //     (data: { chatId: string; action: string }) =>
  //       onRecievedChatAction(chatId as string, data.chatId, data.action)
  //   );
  //   socket?.on("account-suspended-recieved", () => onAccountSuspended());
  //   return () => {
  //     socket?.off(
  //       "chat-message-received",
  //       (data: { message: FullChatMessage }) =>
  //         onMessageRecieved(
  //           chatId as string,
  //           data.message.chatId,
  //           data.message.id,
  //           isChatOpen && isOpen
  //         )
  //     );
  //     socket?.off(
  //       "chat-action-received",
  //       (data: { chatId: string; action: string }) =>
  //         onRecievedChatAction(chatId as string, data.chatId, data.action)
  //     );
  //     socket?.off("account-suspended-recieved", () => onAccountSuspended());
  //   };
  // }, [chatId, isOpen, isChatOpen]);

  // useEffect(() => {
  //   setChatOpen(isChatOpen);
  //   console.log(isChatOpen);
  // }, [isChatOpen]);
  return {
    audioRef,
    invalidateNav,
  };
};

const LeadLink = ({ leadId }: { leadId: string }) => {
  return (
    <Link className="bg-emerald-700 text-white" href={`/leads/${leadId}`}>
      View Details
    </Link>
  );
};
