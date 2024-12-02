import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useInvalidate } from "../use-invalidate";
import { useSocketStore } from "../use-socket-store";

import { Notification } from "@prisma/client";
import {
  getUnreadNotifications,
  updateUnreadNotification,
} from "@/actions/notification";
import { create } from "zustand";

type State = { isNotificationOpen: boolean };
type Actions = {
  onNotificationOpen: () => void;
  onNotificationClose: () => void;
};
export const useNotificationStore = create<State & Actions>((set) => ({
  isNotificationOpen: false,
  onNotificationOpen: () => set({ isNotificationOpen: true }),
  onNotificationClose: () => set({ isNotificationOpen: false }),
}));

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
    invalidate("notifications");
    if (!audioRef.current) return;
    audioRef.current.volume = 0.5;
    audioRef.current.play();
  };

  //TODO-Need to include the notification id and create a new notification toast dialog thing
  useEffect(() => {
    socket?.on("notification-recieved", onPlay);
    return () => {
      socket?.off("notification-recieved", onPlay);
    };
    // eslint-disable-next-line
  }, []);
  return {
    audioRef,
    onUpdateNotificationUnread,
    updatingNotificationUnread,
  };
};
