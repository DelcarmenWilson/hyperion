import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCallStore } from "@/stores/call-store";
import { useLeadStore } from "@/stores/lead-store";
import Link from "next/link";
import React from "react";

const NotificationActions = ({
  link,
  linkText,
}: {
  link: string | null;
  linkText: string | null;
}) => {
  const { onMultipleLeadDialogOpen } = useLeadStore();
  const { onMultipleCallDialogOpen } = useCallStore();
  if (!link) return null;
  return (
    <div>
      {linkText == "View Leads" ? (
        <Button
          variant="outlineprimary"
          size="xs"
          onClick={() => onMultipleLeadDialogOpen(JSON.parse(link))}
        >
          {linkText}
        </Button>
      ) : linkText == "View Calls" ? (
        <Button
          variant="outlineprimary"
          size="xs"
          onClick={() => onMultipleCallDialogOpen(JSON.parse(link))}
        >
          {linkText}
        </Button>
      ) : (
        <Link
          className={cn(
            buttonVariants({
              variant: "outlineprimary",
              size: "xs",
            })
          )}
          href={link}
        >
          {linkText}
        </Link>
      )}
    </div>
  );
};

export default NotificationActions;
