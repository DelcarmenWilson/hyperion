"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { userEmitter } from "@/lib/event-emmiter";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { leadUpdateByIdNotes } from "@/actions/lead";

type NoteFormProps = {
  leadId: string;
  intialNotes: string;
};

export const NotesForm = ({ leadId, intialNotes }: NoteFormProps) => {
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState(intialNotes || "");

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
    </div>
  );
};
