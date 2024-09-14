"use client";

import { toast } from "sonner";

import {
  useAppointmentCancelFormActions,
  useAppointmentData,
} from "../../../hooks/use-appointment";

import { CardData } from "@/components/reusable/card-data";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { appointmentCanceledByLead } from "@/actions/appointment";
import { useEffect, useState } from "react";
import { formatDateTime } from "@/formulas/dates";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { ErrorCard } from "../../../components/error-card";
import Link from "next/link";

const CancelPage = () => {
  const {
    loading,
    appointmentId,
    username,
    reason,
    setReason,
    appointment,
    isFetchingAppointment,
    cancel,
    onSubmit,
  } = useAppointmentCancelFormActions();

  if (cancel) return <CancelCard />;
  const leadName = `${appointment?.lead?.firstName} ${appointment?.lead?.lastName}`;
  const reschedulelink = `/book/${username}/${appointmentId}`;

  return (
    <SkeletonWrapper isLoading={isFetchingAppointment} fullHeight fullWidth>
      {!appointmentId || !appointment ? (
        <ErrorCard />
      ) : (
        <div className="container flex-center h-full">
          <div className="flex flex-col bg-primary/25 p-2 m-auto w-[400px] gap-2 ">
            <p className="text-lg text-primary font-bold">{leadName}</p>

            <CardData
              label={"Local Date"}
              value={formatDateTime(appointment?.localDate)}
            />
            <CardData
              label={"Start Date"}
              value={formatDateTime(appointment?.startDate)}
            />

            <div>
              <Label>Reason for cancellation (optional)</Label>
              <Textarea
                className="bg-white"
                value={reason}
                disabled={loading}
                onChange={(e) => setReason(e.target.value)}
                rows={5}
              />
              <p className="text-end text-sm">
                Need to reschedule instead?
                <Link
                  className="hover:text-primary hover:underline"
                  href={reschedulelink}
                >
                  Click here
                </Link>
              </p>
            </div>
            <div className="flex justify-end">
              <Button
                variant="destructive"
                disabled={loading}
                onClick={onSubmit}
              >
                Cancel Appointment
              </Button>
            </div>
          </div>
        </div>
      )}
    </SkeletonWrapper>
  );
};

export default CancelPage;

const CancelCard = () => {
  return (
    <div className="container flex-center h-full">
      <div className="bg-primary/25 p-2 m-auto w-[400px] border rounded-xl">
        <p className="text-2xl font-bold text-center">
          This apointment has been cancelled!
        </p>

        {/* <Button
          variant="ghost"
          onClick={() => {
            console.log(window);
            window.opener = null;
            window.open("", "_self");
            window.close();
          }}
        >
          close window
        </Button> */}
      </div>
    </div>
  );
};
