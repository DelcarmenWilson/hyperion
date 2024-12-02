"use client";

import { useNotificationStore } from "@/hooks/notification/use-notification";
import { cn } from "@/lib/utils";
import React from "react";
import { Button, buttonVariants } from "../ui/button";
import { Bell, Ghost, X } from "lucide-react";
import Link from "next/link";

const NotificationDialog = () => {
  const { isNotificationOpen, onNotificationClose } = useNotificationStore();
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden h-[200px] w-[300px] bg-background fixed right-5 -bottom-full border-primary border-[5px] rounded-xl p-2 transition-[bottom] ease-in-out duration-500",
        isNotificationOpen && "bottom-0"
      )}
    >
      <div className="flex items-center justify-between px-2">
        <p className="flex items-center gap-2 font-semibold text-sm text-muted-foreground">
          <Bell size={15} />
          Notification
        </p>

        <Button variant="simple" size="sm" onClick={onNotificationClose}>
          <X size={15} />
        </Button>
      </div>
      <div className="h-full w-full flex flex-col gap-2"> 
        
        <p className="text-primary font-bold text-sm text-center">Title</p>
        <p className="font-bold italic text-sm">This is for content</p>
        
<div className="grid grid-cols-2 items-center mt-auto gap-2">
 <Button variant="ghost" size="sm">Dismiss</Button>
 <Link href="/appointment" className={cn(buttonVariants({
    variant:"outlineprimary", size:"sm"
 }))} >View Appointment</Link>

</div>

      </div>
    </div>
  );
};

export default NotificationDialog;
