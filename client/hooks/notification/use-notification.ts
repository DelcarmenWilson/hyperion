import { useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useInvalidate } from "../use-invalidate";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { toast } from "sonner";

import { Notification } from "@prisma/client";
import {
  getMultipledNotifications,
  getNotification,
  getUnreadNotifications,
  updateUnreadNotification,
} from "@/actions/notification";

type State = {
  notificationId?: string;
  notificationIds?: string[];
  isNotificationOpen: boolean;
};
type Actions = {
  onNotificationOpen: (n: string) => void;
  onNotificationClose: (n: string) => void;
};

export const useNotificationStore = create<State & Actions>()(
  immer((set) => ({
    isNotificationOpen: false,
    onNotificationOpen: (n) =>
      set((state) => {
        state.notificationIds?.push(n);
        state.isNotificationOpen = true;
      }),
    onNotificationClose: (n) =>
      set((state) => {
        if (n == "clear") state.notificationIds = [];
        else
          state.notificationIds = state.notificationIds?.filter((e) => e != n);
        if (state.notificationIds?.length == 0)
          state.isNotificationOpen = false;
      }),
  }))
);

export const useNotificationData = () => {
  const { notificationId, notificationIds } = useNotificationStore();
  const onGetNotification = () => {
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
  const onGetMultipleNotifications = () => {
    const {
      data: notifications,
      isFetching: notificationsFetching,
      isLoading: notificationsLoading,
    } = useQuery<Notification[] | null>({
      queryFn: () => getMultipledNotifications(notificationIds),
      queryKey: [`notifications-${notificationIds}`],
      enabled: !!notificationIds,
    });
    return { notifications, notificationsFetching, notificationsLoading };
  };
  return {
    onGetNotification,
    onGetMultipleNotifications,
    onGetNotificationsUnread,
  };
};

export const useNotificationActions = () => {
  const { invalidate } = useInvalidate();
  const { onNotificationClose } = useNotificationStore();

  //UPDATE UNREAD NOTIFICATIONS
  const {
    mutate: updateNotificationUnreadMutate,
    isPending: updatingNotificationUnread,
  } = useMutation({
    mutationFn: updateUnreadNotification,
    onSuccess: (results) => {
      onNotificationClose(results);
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
