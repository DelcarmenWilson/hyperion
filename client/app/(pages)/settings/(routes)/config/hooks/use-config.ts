import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { NotificationSettings } from "@prisma/client";
import {
  notificationSettingsGet,
  notificationSettingsUpdate,
} from "@/actions/settings/notification";
import { toast } from "sonner";
import { NotificationSettingsSchemaType } from "@/schemas/settings";
import { userGetAdAccount, userUpdateAdAccount } from "@/actions/user";

export const useNotificationData = () => {
  const { update } = useSession();
  const [loading, setLoading] = useState(false);

  const { data: settings, isFetching: isFetchingSettings } =
    useQuery<NotificationSettings | null>({
      queryFn: () => notificationSettingsGet(),
      queryKey: ["notificationSettings"],
    });

  const onNotificationSettingsSubmit = async (
    values: NotificationSettingsSchemaType
  ) => {
    setLoading(true);
    const updatedSettings = await notificationSettingsUpdate(values);
    if (updatedSettings.success) {
      toast.success(updatedSettings.success);
      update();
    } else toast.error(updatedSettings.error);
    setLoading(false);
  };

  return {
    settings,
    isFetchingSettings,
    loading,
    onNotificationSettingsSubmit,
  };
};

export const useFacebookData = () => {    
  const [loading, setLoading] = useState(false);
  const queryClient=useQueryClient()

  const { data: adAccount, isFetching: isFetchingAdAccount } = useQuery<
    string | null
  >({
    queryFn: () => userGetAdAccount(),
    queryKey: ["adAccount"], 
  },);

  const onAdAccountSubmit = async (values: string) => {
    setLoading(true);
    const updatedAdAccount = await userUpdateAdAccount(values);
    if (updatedAdAccount.success) {
      toast.success(updatedAdAccount.success);
      queryClient.invalidateQueries({queryKey:["adAccount"]})
    }

     else toast.error(updatedAdAccount.error);
    setLoading(false);
  };

  return {
    adAccount,
    isFetchingAdAccount,
    loading,
    onAdAccountSubmit,
  };
};
