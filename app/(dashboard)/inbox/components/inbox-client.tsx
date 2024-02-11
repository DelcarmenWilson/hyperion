import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlarmClock, CircleSlash, MessageSquareText } from "lucide-react";
import React from "react";

export const InboxClient2 = () => {
  return (
    <div className="flex gap-2 pt-4 mr-4">
      <Button variant="outlineprimary" size="sm">
        <AlarmClock className="h-4 w-4 mr-2" />
        VIEW SCHEDULED TEXTS
      </Button>
      <Button variant="outlineprimary" size="sm">
        <MessageSquareText className="h-4 w-4 mr-2" />
        VIEW SENT TEXTS
      </Button>
      <Button variant="outlineprimary" className="relative" size="sm">
        <CircleSlash className="h-4 w-4 mr-2" />
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
