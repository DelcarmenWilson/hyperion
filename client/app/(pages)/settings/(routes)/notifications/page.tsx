"use client";
import { NotificationForm } from "./form";
import { useNotificationData } from "../config/hooks/use-config";
import SkeletonWrapper from "@/components/skeleton-wrapper";

const NotificationPage = () => {
  const { settings, isFetchingSettings } = useNotificationData();

  return (
    <SkeletonWrapper isLoading={isFetchingSettings}>
      <NotificationForm notificationSettings={settings!} />
    </SkeletonWrapper>
  );
};

export default NotificationPage;
