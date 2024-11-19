import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useInvalidate } from "../use-invalidate";
import { useSocketStore } from "../use-socket-store";

import { getUnreadNotifications } from "@/actions/notification/get-unread-notifications";
import { Notification } from "@prisma/client";
import { updateUnreadNotification } from "@/actions/notification/update-unread-notification";

export const useNotificationData = () => {
  const onGetNotificationsUnread = () => {
    const {
      data: notifications,
      isFetching: fetchingNotifications,
      isLoading: loadingNotifications,
    } = useQuery<Notification[]>({
      queryFn: () => getUnreadNotifications(),
      queryKey: [`notifications`],
    });

    return { notifications, fetchingNotifications, loadingNotifications };
  };
  return {
    onGetNotificationsUnread,
  };
};

export const useNotificationActions = () => {
  const { socket } = useSocketStore();
  const { invalidate } = useInvalidate();
  const audioRef = useRef<HTMLAudioElement>(null);

  //UPDATE UNREAD NOTIFICATIONS
  const {
    mutate: updateNotificationUnreadMutate,
    isPending: updatingNotificationUnread,
  } = useMutation({
    mutationFn: updateUnreadNotification,
    onSuccess: () => {
      invalidate("notifications");
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
    invalidate("navbar-conversations");
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
    onUpdateNotificationUnread,
    updatingNotificationUnread,
  };
};
