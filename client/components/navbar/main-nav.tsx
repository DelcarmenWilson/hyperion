"use client";
import { useState } from "react";
import { useMainChatActions, useMainNav } from "./hooks/use-main-nav";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import AdminTestMenu from "./admin-test-menu";
import { CoachNotification } from "../phone/coach-notification";
import { TextAnimation } from "../custom/text-animate";
import { PageNotification } from "./page-notification";

type Props = {
  admin?: boolean;
};
export const MainNav = ({ admin }: Props) => {
  const {
    user,
    isNotificationOpen,
    onSheduledLeads,
    onSendEmail,
    conference,
    onJoinCall,
    onRejectCall,
  } = useMainNav();

  const { audioRef } = useMainChatActions();

  const [isPageNotificationOpen, setIsPageNotificationOpen] = useState(false);

  const pname = usePathname().split("/");
  const pathname = admin
    ? pname[2].replace("-", " ")
    : pname[1].replace("-", " ");

  return (
    <div className={cn(" flex-1 hidden", "md:flex")}>
      <audio
        ref={audioRef}
        src={`/sounds/${user?.messageInternalNotification}.wav`}
      />

      <TextAnimation
        text={pathname}
        textAnchor="left"
        viewBox="0 0 700 160"
        x="0"
        y="70%"
      />

      <AdminTestMenu />

      <CoachNotification
        conference={conference}
        isOpen={isNotificationOpen}
        onJoinCall={onJoinCall}
        onRejectCall={onRejectCall}
      />
      <PageNotification
        isOpen={isPageNotificationOpen}
        onClose={() => setIsPageNotificationOpen(false)}
      />
    </div>
  );
};
