"use client";
import { Fragment, useState } from "react";

import { Dialog, Transition } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TwilioShortConference } from "@/types/twilio";

type CoachNotificationProps = {
  conference: TwilioShortConference | undefined;
  isOpen: boolean;
  onJoinCall: () => void;
  onRejectCall: (e: string) => void;
};
export const CoachNotification = ({
  conference,
  isOpen,
  onJoinCall,
  onRejectCall,
}: CoachNotificationProps) => {
  const [reason, setReason] = useState(
    "Currently on the call with another client"
  );
  const defaultReasons: string[] = [
    "Currently on the call with another client",
    " Unavailable",
  ];
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50 pointer-events-none"
        onClose={() => {}}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden pointer-events-none ">
          <div className="flex justify-center w-full h-full overflow-hidden pointer-events-none p-10 items-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Panel className="pointer-events-auto w-[400px]">
                <div className="flex flex-col gap-2 overflow-y-auto bg-background p-2 shadow-xl rounded-md h-52">
                  <h4 className="text-lg text-center font-bold">
                    {conference?.agentName} Needs your help with a lead
                  </h4>
                  <p className="text-sm font-semibold">
                    Lead Name:
                    <span className=" italic">{conference?.leadName}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Reject Reason (optional)
                  </p>
                  <Select
                    name="ddlReason"
                    onValueChange={setReason}
                    defaultValue={reason}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value={"Currently on the call with another client"}
                      >
                        Currently on the call with another client
                      </SelectItem>
                      <SelectItem value={"Unavailable"}>Unavailable</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="mt-auto grid grid-cols-2 items-center gap-2">
                    <Button
                      variant="outlinedestructive"
                      onClick={() => onRejectCall(reason)}
                    >
                      Reject
                    </Button>

                    <Button
                      variant="outlineprimary"
                      className="gap-2"
                      onClick={onJoinCall}
                    >
                      Join Call
                    </Button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
