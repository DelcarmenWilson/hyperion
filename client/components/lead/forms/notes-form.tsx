"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { userEmitter } from "@/lib/event-emmiter";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { leadUpdateByIdNotes, leadUpdateByIdShare } from "@/actions/lead";
import { User } from "@prisma/client";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Ghost, X } from "lucide-react";

type NoteFormProps = {
  leadId: string;
  intialNotes: string;
  initSharedUser: User | null | undefined;
};

export const NotesForm = ({
  leadId,
  intialNotes,
  initSharedUser,
}: NoteFormProps) => {
  const user = useCurrentUser();
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState(intialNotes || "");
  const [sharedUser, setSharedUser] = useState(initSharedUser);

  const onNotesUpdated = async () => {
    if (!notes) return;
    setLoading(true);
    await leadUpdateByIdNotes(leadId, notes).then((data) => {
      if (data.success) {
        userEmitter.emit(
          "newNote",
          data.success.id,
          data.success.notes as string
        );
        toast.success("Lead notes have been updated");
      }
      if (data.error) {
        toast.error(data.error);
      }
    });
    setLoading(false);
  };
  const onUnShareLead = () => {
    setSharedUser(null);
    leadUpdateByIdShare(leadId, undefined).then((data) => {
      if (data.success) {
        toast.success(data.success);
      }
      if (data.error) {
        toast.error(data.error);
      }
    });
  };
  useEffect(() => {
    setNotes(intialNotes);
    const onSetNotes = (newLeadId: string, newNotes: string) => {
      if (leadId == newLeadId) setNotes(newNotes);
    };
    userEmitter.on("newNote", (leadId, notes) => onSetNotes(leadId, notes));
  }, [intialNotes]);

  return (
    <div className="flex flex-col">
      <Textarea
        placeholder="Additional notes here"
        className="rounded-br-none rounded-bl-none"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
      />
      <Button
        className="rounded-tr-none rounded-tl-none"
        variant="outlineprimary"
        disabled={loading}
        onClick={onNotesUpdated}
      >
        UPDATE NOTES
      </Button>

      {sharedUser && user?.role != "ASSISTANT" && (
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
                onClick={() => {
                  setSharedUser(undefined);
                  onUnShareLead();
                }}
              >
                <X size={16} />
              </Button>
            </h4>
          )}
        </div>
      )}
    </div>
  );
};