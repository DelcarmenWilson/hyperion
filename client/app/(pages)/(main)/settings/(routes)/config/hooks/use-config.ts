import {  useCallback } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { NotificationSettings } from "@prisma/client";
import { NotificationSettingsSchemaType } from "@/schemas/settings";
import {
  notificationSettingsGet,
  notificationSettingsUpdate,
} from "@/actions/settings/notification";

import { getUserAdAccount, updateUserAdAccount } from "@/actions/user";

export const useNotificationData = () => {
  const { data: settings, isFetching: isFetchingSettings } =
    useQuery<NotificationSettings | null>({
      queryFn: () => notificationSettingsGet(),
      queryKey: ["notificationSettings"],
    });

  return {
    settings,
    isFetchingSettings,
  };
};

export const useNotificationActions = () => {
  const { update } = useSession();
  const queryClient = useQueryClient();

  //NOTIFICAITION SETTINGS
  const {
    mutate: notificationSettingsMutate,
    isPending: notificationSettingsIsPending,
  } = useMutation({
    mutationFn: notificationSettingsUpdate,
    onSuccess: (results) => {
      if (results.success) {
        toast.success("Notification Settings Updated", {
          id: "update-notification-settings",
        });
        update();
      } else toast.error(results.error, { id: "update-notification-settings" });
    },
    onError: (error) =>
      toast.error(error.message, { id: "update-notification-settings" }),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["ad-account"] }),
  });

  const onNotificationSettingsSubmit = useCallback(
    (values: NotificationSettingsSchemaType) => {
      toast.loading("Updating Notification Settings...", {
        id: "update-notification-settings",
      });
      notificationSettingsMutate(values);
    },
    [notificationSettingsMutate]
  );

  return {
    onNotificationSettingsSubmit,
    notificationSettingsIsPending,
  };
};

export const useFacebookData = () => {
  const { data: adAccount, isFetching: isFetchingAdAccount } = useQuery<
    string | null
  >({
    queryFn: () => getUserAdAccount(),
    queryKey: ["ad-account"],
  });

  return {
    adAccount,
    isFetchingAdAccount,
  };
};

export const useFacebookActions = () => {
  const queryClient = useQueryClient();
  //AD ACCOUNT
  const { mutate: adAccountMutate, isPending: adAccountIsPending } =
    useMutation({
      mutationFn: updateUserAdAccount,
      onSuccess: () => {        
          toast.success("Ad Account Updated", {
            id: "update-ad-account",
          });
      },
      onError: (error) =>
        toast.error(error.message, { id: "update-ad-account" }),
      onSettled: () =>
        queryClient.invalidateQueries({ queryKey: ["ad-account"] }),
    });

  const onAdAccountSubmit = useCallback(
    (values: string) => {
      toast.loading("Updating Ad Account...", { id: "update-ad-account" });
      adAccountMutate(values);
    },
    [adAccountMutate]
  );

  return {
    adAccountIsPending,
    onAdAccountSubmit,
  };
};
