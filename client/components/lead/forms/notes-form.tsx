"use client";
import { X } from "lucide-react";
import { useCurrentUser } from "@/hooks/user/use-current";
import { useLeadNotesActions } from "@/hooks/lead/use-lead";

import { Button } from "@/components/ui/button";
import { EmptyData } from "../info/empty-data";
import { Textarea } from "@/components/ui/textarea";
import SkeletonWrapper from "@/components/skeleton-wrapper";

type NoteFormProps = {
  leadId: string;
  showShared?: boolean;
  rows?: number;
};

export const NotesForm = ({
  leadId,
  showShared = true,
  rows = 3,
}: NoteFormProps) => {
  const user = useCurrentUser();
  const {
    loading,
    initNotes,
    notes,
    setNotes,
    isFetchingNotes,
    onNotesUpdated,
    onUnShareLead,
  } = useLeadNotesActions(leadId);

  const sharedUser = initNotes?.sharedUser;
  return (
    <SkeletonWrapper isLoading={isFetchingNotes}>
      {initNotes ? (
        <div className="flex flex-col ps-1">
          <Textarea
            placeholder="Additional notes here"
            className="rounded-br-none rounded-bl-none"
            value={notes as string}
            onChange={(e) => setNotes(e.target.value)}
            rows={rows}
          />
          <Button
            className="rounded-tr-none rounded-tl-none"
            variant="outlineprimary"
            disabled={loading || !notes}
            onClick={onNotesUpdated}
          >
            UPDATE NOTES
          </Button>

          {showShared && sharedUser && user?.role != "ASSISTANT" && (
            <div className="text-lg text-center bg-primary text-secondary mt-2">
              {user?.id == sharedUser.id ? (
                <h4 className="relative font-bold text-lg  text-center">
                  SHARED LEAD !!!
                </h4>
              ) : (
                <h4 className="relative font-bold text-lg  text-center">
                  Sharing With:
                  {sharedUser.firstName}
                  <Button
                    className="ms-2"
                    variant="ghost"
                    size="sm"
                    onClick={onUnShareLead}
                  >
                    <X size={16} />
                  </Button>
                </h4>
              )}
            </div>
          )}
        </div>
      ) : (
        <EmptyData />
      )}
    </SkeletonWrapper>
  );
};
