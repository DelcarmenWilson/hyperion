"use client";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/user/use-current";
import {
  useNotificationActions,
  useNotificationData,
} from "@/hooks/notification/use-notification";

import { Notification } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

import { DataDisplayItalic } from "@/components/global/data-display/data-display";
import NewEmptyCard from "@/components/reusable/new-empty-card";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { formatDate } from "@/formulas/dates";

export const NavNotifications = () => {
  const user = useCurrentUser();
  const { onGetNotificationsUnread } = useNotificationData();
  const { notifications, fetchingNotifications } = onGetNotificationsUnread();
  const { audioRef, onUpdateNotificationUnread, updatingNotificationUnread } =
    useNotificationActions();

  return (
    <div>
      <audio ref={audioRef} src={`/sounds/${user?.messageNotification}.wav`} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="relative" size="icon" variant="outline">
            <Bell size={16} />
            {notifications && notifications?.length > 0 && (
              <Badge className="absolute rounded-full text-xs -top-2 -right-2">
                {notifications.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <SkeletonWrapper isLoading={fetchingNotifications}>
          <DropdownMenuContent
            className="flex flex-col max-h-[450px] w-full lg:w-[300px] "
            align="center"
          >
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>

            {!notifications?.length && !fetchingNotifications && (
              <NewEmptyCard title="You Are all Caught Up" icon={Bell} />
            )}
            {notifications && notifications?.length > 0 && (
              <>
                {/* //TODO - was not able to use scroll are here lets see why */}
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
                <Button
                  className="mt-2 w-full"
                  disabled={updatingNotificationUnread}
                  onClick={() => onUpdateNotificationUnread("clear")}
                >
                  Mark all as Read
                </Button>
              </>
            )}
          </DropdownMenuContent>
        </SkeletonWrapper>
      </DropdownMenu>
    </div>
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
  const router = useRouter();
  return (
    <div className="w-full p-2 bg-background hover:bg-primary/25 border-b">
      <p className="text-xs text-muted-foreground text-end italic">
        {formatDate(createdAt)}
      </p>
      <p className="text-primary text-sm text-center font-semibold">{title}</p>
      <DataDisplayItalic title={reference} value={content!} />
      <div className="flex justify-between items-center">
        <Button variant="secondary" size="xs" onClick={onDismiss}>
          Dismiss
        </Button>
        {link && (
          <Button
            variant="outlineprimary"
            size="xs"
            onClick={() => {
              onDismiss();
              router.push(link);
            }}
          >
            {linkText}
          </Button>
        )}
      </div>
    </div>
  );
};
