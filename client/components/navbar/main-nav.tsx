"use client";
import { useMainNav } from "./hooks/use-main-nav";

import { Button } from "@/components/ui/button";
import { CoachNotification } from "../phone/coach-notification";
import { cn } from "@/lib/utils";
import { TextAnimation } from "../custom/text-animate";

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

  return (
    <div className={cn(" flex-1 hidden", "md:flex")}>
      {/* TODO - dont forget remove these test buttons */}
      {/* <Button onClick={() => onPhoneInOpen()}>OpenModel</Button> */}
      {/* <Button onClick={() => onOpen("Text", "Text")}>Open Group Message</Button> */}

      {/* <Button onClick={onReminders}>Reminders</Button> 
       <Button onClick={() => onGetFacebookData("campaigns")}>Campaings</Button> 
      <Button onClick={() => onGetFacebookData("leads")}>Leads</Button>
      <Button onClick={() => onGetFacebookData("adSets")}>AdSets</Button>
      <Button onClick={() => onGetFacebookData("ads")}>Ads</Button> 
      <Button onClick={() => onGetFacebookData("audiences")}>Audiences</Button>
      <Button onClick={() => onGetFacebookData("creatives")}>Creatives</Button> 
      <Button onClick={() => onGetFacebookData("adImages")}>Ad Images</Button>
      <Button onClick={() => onGetFacebookData("forms")}>Forms</Button>*/}
      {/* {user?.role == "MASTER" && (
        <>
          <Button onClick={onSendEmail}>Send Email</Button>
          <Button onClick={onSheduledLeads}>Schedule Leads</Button>
        </>
      )} */}
      {admin && (
        <TextAnimation
          text="Admin Panel"
          textAnchor="left"
          viewBox="0 0 700 160"
          x="0"
          y="70%"
        />
      )}
      <CoachNotification
        conference={conference}
        isOpen={isNotificationOpen}
        onJoinCall={onJoinCall}
        onRejectCall={onRejectCall}
      />
    </div>
  );
};
