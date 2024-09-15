"use client";
import { NotificationForm } from "./form";
import { useNotificationData } from "../config/hooks/use-config";
import SkeletonWrapper from "@/components/skeleton-wrapper";

const NotificationPage = () => {
  const {
    settings,
    isFetchingSettings,
    loading,
    onNotificationSettingsSubmit,
  } = useNotificationData();

  return (
    <SkeletonWrapper isLoading={isFetchingSettings}>
      <NotificationForm
        notificationSettings={settings!}
        loading={loading}
        onSubmit={onNotificationSettingsSubmit}
      />
    </SkeletonWrapper>
  );
};

export default NotificationPage;
