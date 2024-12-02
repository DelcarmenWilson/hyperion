import { useCallback} from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useInvalidate } from "../use-invalidate";
import { create } from "zustand";
import { toast } from "sonner";

import { Notification } from "@prisma/client";
import {
  getNotification,
  getUnreadNotifications,
  updateUnreadNotification,
} from "@/actions/notification";

type State = { 
  notificationId?:string
  isNotificationOpen: boolean 
};
type Actions = {
  onNotificationOpen: (n:string) => void;
  onNotificationClose: () => void;
};
export const useNotificationStore = create<State & Actions>((set) => ({
  isNotificationOpen: false,
  onNotificationOpen: (n) => set({notificationId:n, isNotificationOpen: true }),
  onNotificationClose: () => set({ isNotificationOpen: false }),
}));

export const useNotificationData = () => {
  const {notificationId}=useNotificationStore()
  const onGetNotification= () => {
    const {
      data: notification,
      isFetching: notificationFetching,
      isLoading: notificationLoading,
    } = useQuery<Notification | null>({
      queryFn: () => getNotification(notificationId as string),
      queryKey: [`notification-${notificationId}`],
      enabled: !!notificationId,
    });
    return { notification, notificationFetching, notificationLoading };
  };
  const onGetNotificationsUnread = () => {
    const {
      data: notifications,
      isFetching: fetchingNotifications,
      isLoading: loadingNotifications,
    } = useQuery<Notification[]>({
      queryFn: () => getUnreadNotifications(),
      queryKey: ["notifications"],
    });

    return { notifications, fetchingNotifications, loadingNotifications };
  };
  return {
    onGetNotification,
    onGetNotificationsUnread,
  };
};

export const useNotificationActions = () => {
  const { invalidate } = useInvalidate();
  const {onNotificationClose}=useNotificationStore()

  //UPDATE UNREAD NOTIFICATIONS
  const {
    mutate: updateNotificationUnreadMutate,
    isPending: updatingNotificationUnread,
  } = useMutation({
    mutationFn: updateUnreadNotification,
    onSuccess: () => {
      onNotificationClose()
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
  
  return {
    onUpdateNotificationUnread,
    updatingNotificationUnread,
  };
};
