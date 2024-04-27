import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlarmClock, CircleSlash, MessageSquareText } from "lucide-react";
import React from "react";

export const InboxClient2 = () => {
  return (
    <div className="flex gap-2 pt-4 mr-4">
      <Button className="gap-2" variant="outlineprimary" size="sm">
        <AlarmClock size={16} />
        VIEW SCHEDULED TEXTS
      </Button>
      <Button className="gap-2" variant="outlineprimary" size="sm">
        <MessageSquareText size={16} />
        VIEW SENT TEXTS
      </Button>
      <Button variant="outlineprimary" className="relative gap-2" size="sm">
        <CircleSlash size={16} />
        VIEW REJECTED TEXTS
        <Badge
          variant="destructive"
          className="absolute -top-3 -right-3 rounded-full"
        >
          13
        </Badge>
      </Button>
    </div>
  );
};
