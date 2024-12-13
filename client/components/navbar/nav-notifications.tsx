"use client";
import { Bell } from "lucide-react";
import {
  useNotificationActions,
  useNotificationData,
} from "@/hooks/notification/use-notification";

import Link from "next/link";

import { Notification } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import NewEmptyCard from "@/components/reusable/new-empty-card";
import Hint from "../custom/hint";
import NotificationActions from "../global/notification-actions";
import { ScrollArea } from "@/components/ui/scroll-area";
import SkeletonWrapper from "@/components/skeleton-wrapper";

import { formatDate } from "@/formulas/dates";

const NavNotifications = () => {
  const { onGetNotificationsUnread } = useNotificationData();
  const { notifications, fetchingNotifications } = onGetNotificationsUnread();
  const { onUpdateNotificationUnread, updatingNotificationUnread } =
    useNotificationActions();

  return (
    <DropdownMenu>
      <Hint label="Notifications">
        <DropdownMenuTrigger asChild>
          <Button className="relative" size="icon" variant="outline">
            <Bell size={20} />
            {notifications && notifications?.length > 0 && (
              <Badge className="absolute rounded-full text-xs -top-2 -right-2">
                {notifications.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
      </Hint>

      <DropdownMenuContent
        className="w-full lg:w-[300px] overflow-hidden"
        align="center"
      >
        <DropdownMenuLabel className="flex justify-between">
          Notifications
          <Link href="/notifications" className="text-xs underline">
            View All
          </Link>
        </DropdownMenuLabel>
        <SkeletonWrapper isLoading={fetchingNotifications}>
          <ScrollArea>
            <div className="max-h-[400px]">
              {!notifications?.length && !fetchingNotifications && (
                <NewEmptyCard title="You Are all Caught Up" icon={Bell} />
              )}
              {notifications && notifications?.length > 0 && (
                <div className="flex-1 h-full overflow-y-auto">
                  {notifications?.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onDismiss={() =>
                        onUpdateNotificationUnread(notification.id)
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
          {notifications && notifications?.length > 0 && (
            <Button
              className="mt-2 w-full"
              disabled={updatingNotificationUnread}
              onClick={() => onUpdateNotificationUnread("clear")}
            >
              Mark all as Read
            </Button>
          )}
        </SkeletonWrapper>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const NotificationCard = ({
  notification,
  onDismiss,
}: {
  notification: Notification;
  onDismiss: () => void;
}) => {
  const { title, content, linkText, link, reference, createdAt } = notification;
  return (
    <div className="w-full p-2 bg-background hover:bg-primary/25 border-b">
      <div className="flex justify-between items-center">
        <span className="text-primary text-sm text-center font-semibold">
          {title}
        </span>
        <span className="text-xs text-muted-foreground italic">
          {formatDate(createdAt)}
        </span>
      </div>
      <p className="text-sm font-bold italic p-2">{content}</p>
      <div className="flex justify-between items-center">
        <Button variant="secondary" size="xs" onClick={onDismiss}>
          Dismiss
        </Button>
        <NotificationActions link={link} linkText={linkText} />
      </div>
    </div>
  );
};

export default NavNotifications;
