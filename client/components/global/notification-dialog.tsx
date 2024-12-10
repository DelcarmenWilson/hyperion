"use client";
import React from "react";
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

const NotificationDialog = () => {
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
      <div className="relative flex flex-col bg-background  w-full gap-2 p-2 rounded-sm ">
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
                          onUpdateNotificationUnread(notification?.id as string)
                        }
                      >
                        Dismiss
                      </Button>

                      {notification?.link && (
                        <Link
                          href={notification.link}
                          className={cn(
                            buttonVariants({
                              variant: "outlineprimary",
                              size: "sm",
                            })
                          )}
                          onClick={() =>
                            onUpdateNotificationUnread(
                              notification?.id as string
                            )
                          }
                        >
                          {notification?.linkText}
                        </Link>
                      )}
                    </div>
                  </div>
                </SkeletonWrapper>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default NotificationDialog;
