"use client";
import React, { useState } from "react";
import { XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAppointmentCancel } from "@/hooks/use-appointment";

type Props = {
  id: string;
};
const CancelAppointmentDialog = ({ id }: Props) => {
  const [reason, setReason] = useState("");
  const { onCancelAppointment, AppointmentCancelling } = useAppointmentCancel();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className="w-full justify-between items-center"
        >
          <span className="sr-only">Cancel Appointment</span>
          <span>Cancel</span> <XCircle size={16} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Do you really want to cancel this appointment?
            <div className="flex flex-col py-4 gap-2">
              <p>If yes please enter a reason below:</p>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setReason("")}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={reason.length == 0 || AppointmentCancelling}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => {
              onCancelAppointment({ id, reason });
              setReason("");
            }}
          >
            Proceed
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancelAppointmentDialog;
