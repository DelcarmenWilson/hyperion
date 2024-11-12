import { useCallback, useContext, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {  ShortConvo } from "@/types";
import {
  conversationsGetByUserIdUnread,
  conversationUpdateByIdUnread,
} from "@/actions/lead/conversation";
import SocketContext from "@/providers/socket";
import { toast } from "sonner";
import { getNotificationsUnread } from "@/actions/notification/get-notifications-unread";
import { Notification } from "@prisma/client";
import { updateNotificationUnread } from "@/actions/notification/update-notification-unread";
import { useSocketStore } from "../use-socket-store";
import { useInvalidate } from "../use-invalidate";


export const useNotificationData = () => {

  const onGetNotificationsUnread=()=>{

  const { data: notifications, isFetching: fetchingNotifications,isLoading:loadingNotifications } = useQuery<
    Notification[]
  >({
    queryFn: () => getNotificationsUnread(),
    queryKey: [`notifications`],
  });

  return {notifications,fetchingNotifications,loadingNotifications}
}
  return {
    onGetNotificationsUnread
  };
};

export const useNotificationActions = () => {
  const { socket } = useSocketStore()
  const {invalidate} = useInvalidate();
  const audioRef = useRef<HTMLAudioElement>(null); 
 

   
  //UPDATE NOTIFICATIONS UNDREAD
  const { mutate: updateNotificationUnreadMutate, isPending: updatingNotificationUnread } = useMutation({
    mutationFn: updateNotificationUnread,
    onSuccess: () => {      
        invalidate("notifications")
    },
    onError: () => {
      toast.error("Failed to update unread notifications");
    },
  });


    const onUpdateNotificationUnread = useCallback(
    (id: string) => {
      updateNotificationUnreadMutate(id);
    },
    [updateNotificationUnreadMutate]
  );


  // GENERAL FUNCTIONS
  const onPlay = () => {
    invalidate("navbar-conversations")
    if (!audioRef.current) return;
    audioRef.current.volume = 0.5;
    audioRef.current.play();
  };

  //Need to change this to notifications
  useEffect(() => {
    socket?.on("conversation-message-notify", onPlay);
    return () => {
      socket?.off("conversation-message-notify", onPlay);
    };
    // eslint-disable-next-line
  }, []);
  return {
    audioRef,
    onUpdateNotificationUnread,updatingNotificationUnread
  };
};