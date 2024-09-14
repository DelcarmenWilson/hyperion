"use client";
import { Reply, Share } from "lucide-react";
import { useCurrentRole } from "@/hooks/user-current-role";
import { useLeadStore } from "@/hooks/lead/use-lead";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
type Props = {
  leadIds: string[];
  onClose: () => void;
};
export const LeadFilterDropDown = ({ leadIds, onClose }: Props) => {
  const role = useCurrentRole();
  const { onShareFormOpen, onTransferFormOpen } = useLeadStore();
  const isAssistant = role == "ASSISTANT";
  const leadFullName = `Multiple Leads (${leadIds.length})`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        {!isAssistant && (
          <>
            <DropdownMenuItem
              className="cursor-pointer gap-2"
              onClick={() =>
                onShareFormOpen(leadIds, leadFullName, undefined, onClose)
              }
            >
              <Share size={16} />
              {`Share Lead${leadIds.length > 1 ? "s" : ""}`}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer gap-2"
              onClick={() => onTransferFormOpen(leadIds, leadFullName, onClose)}
            >
              <Reply size={16} />
              {`Transfer Lead${leadIds.length > 1 ? "s" : ""}`}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
