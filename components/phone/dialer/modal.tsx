"use client";
import { Fragment, useEffect, useRef } from "react";

import { usePhone } from "@/hooks/use-phone";

import { Dialog, Transition } from "@headlessui/react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { PhoneLeadInfo } from "@/components/phone/addins/lead-info";
import { LeadDialerCard } from "./lead-card";
import { DialerMenu } from "./menu";

import { pipelineUpdateByIdIndex } from "@/actions/pipeline";

export const PhoneDialerModal = () => {
  const {
    isPhoneDialerOpen,
    onSetLead,
    onSetIndex,
    leads,
    lead,
    pipeline,
    pipIndex,
  } = usePhone();

  const indexRef = useRef<HTMLDivElement>(null);

  const setIndex = (reset: boolean = false) => {
    const idx = reset ? 0 : pipIndex + 1;
    onSetIndex(idx);
    if (!leads) return;
    onSetLead(leads[idx]);
    pipelineUpdateByIdIndex(pipeline?.id!, idx);
  };

  useEffect(() => {
    if (!leads) return;
    onSetLead(leads[pipIndex]);
    if (!indexRef.current) return;
    indexRef.current.scrollIntoView({
      behavior: "smooth",
      inline: "nearest",
    });
  }, [pipIndex, leads]);

  if (leads == undefined) return null;
  return (
    <Transition.Root show={isPhoneDialerOpen} as={Fragment}>
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
          <div className="flex flex-col w-full h-full overflow-hidden pointer-events-none py-5 px-20 items-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Panel className="pointer-events-auto w-full h-full overflow-hidden  m-4">
                <div className="flex flex-col justify-between gap-2 overflow-hidden h-full bg-background p-2 shadow-xl rounded-md text-sm">
                  <DialerMenu setIndex={setIndex} />

                  <div className="flex flex-1 gap-2 overflow-hidden h-full">
                    <div className="border border-secondary w-1/4 overflow-hidden h-full">
                      <ScrollArea className="h-full">
                        {leads.map((lead, i) => (
                          <LeadDialerCard
                            key={lead.id}
                            lead={lead}
                            indexRef={i == pipIndex ? indexRef : null}
                          />
                        ))}
                      </ScrollArea>
                    </div>
                    <div className="flex flex-col flex-1 border border-secondary h-full overflow-hidden">
                      {lead && <PhoneLeadInfo open />}
                    </div>
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
