import { useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useInvalidate } from "../use-invalidate";
import { toast } from "sonner";
import { useNotificationStore } from "@/stores/notification-store";

import { Notification } from "@prisma/client";
import {
  getFilteredNotifications,
  getMultipledNotifications,
  getNotification,
  getUnreadNotifications,
  updateUnreadNotification,
} from "@/actions/notification";
import { DateRange } from "react-day-picker";


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
  const onGetFilteredNotifications=(dateRange: DateRange)=>{
    const {
      data: notifications,
      isFetching: notificationsFetching,
      isLoading: notificationsLoading,
    } = useQuery<Notification[] | []>({
      queryFn: () => getFilteredNotifications(dateRange),
      queryKey: ["notifications-filtered"]
    });
    return { notifications, notificationsFetching, notificationsLoading };
  }
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
    onGetFilteredNotifications,
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
