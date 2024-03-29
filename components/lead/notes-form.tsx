"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { leadUpdateByIdNotes } from "@/actions/lead";
import { useState } from "react";
import { toast } from "sonner";

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
        toast.success(data.success);
      }
      if (data.error) {
        toast.error(data.error);
      }
    });
    setLoading(false);
  };

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
