"use client";
import React, { useState } from "react";
import { useNotificationStore } from "@/stores/notification-store";
import {
  useNotificationActions,
  useNotificationData,
} from "@/hooks/notification/use-notification";
import { cn } from "@/lib/utils";
import { Bell, X } from "lucide-react";
import Link from "next/link";

import { Button, buttonVariants } from "../ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import SkeletonWrapper from "../skeleton-wrapper";
import { useLeadStore } from "@/stores/lead-store";
import { useCallStore } from "@/stores/call-store";
import { TimerBar } from "./time-bar";
import NotificationActions from "./notification-actions";

const NotificationDialog = () => {
  const [hover, setHover] = useState(false);
  const { onMultipleLeadDialogOpen } = useLeadStore();
  const { onMultipleCallDialogOpen } = useCallStore();
  const { notificationIds, isNotificationOpen, onNotificationClose } =
    useNotificationStore();
  const { onGetMultipleNotifications } = useNotificationData();
  // const { notification, notificationFetching } = onGetNotification();
  const { notifications, notificationsFetching, notificationsLoading } =
    onGetMultipleNotifications();
  const { onUpdateNotificationUnread, updatingNotificationUnread } =
    useNotificationActions();

  const count = notificationIds?.length;
  return (
    <div
      className={cn(
        "fixed -bottom-full right-5 transition-[bottom] ease-in-out duration-500 w-full lg:w-[300px] z-[100] bg-gradient overflow-hidden rounded p-[1px]",
        isNotificationOpen && "bottom-0"
      )}
    >
      <div
        className="relative flex flex-col bg-background  w-full gap-2 p-2 rounded-sm "
        onMouseEnter={() => setHover(true)}
      >
        <Carousel className="w-full max-w-xs">
          <div className="flex items-center justify-between px-2">
            <p className="flex items-center gap-2 font-semibold text-sm text-muted-foreground">
              <Bell size={16} />
              Notification
              {count && count > 1 && <span>({count})</span>}
            </p>

            <CarouselPrevious variant="simple" />
            <CarouselNext variant="simple" />

            <Button
              variant="simple"
              size="sm"
              onClick={() => onUpdateNotificationUnread("clear")}
            >
              <X size={16} />
            </Button>
          </div>

          <CarouselContent>
            {notifications?.map((notification) => (
              <CarouselItem key={notification.id}>
                <SkeletonWrapper isLoading={notificationsLoading}>
                  <div className="space-y-2">
                    <p className="text-center text-primary font-bold">
                      {notification?.title}
                    </p>
                    <div className="font-semibold truncate overflow-hidden text-sm italic">
                      {notification?.content}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={updatingNotificationUnread}
                        onClick={() =>
                          onUpdateNotificationUnread(notification.id)
                        }
                      >
                        Dismiss
                      </Button>

                      <NotificationActions
                        link={notification.link}
                        linkText={notification.linkText}
                      />
                    </div>
                  </div>
                </SkeletonWrapper>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="absolute bottom-2 w-full pe-3 pt-2">
          <TimerBar
            hover={hover}
            hold={notificationsFetching}
            duration={10}
            onClose={() => onNotificationClose("clear")}
            enable={!!notifications}
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationDialog;
