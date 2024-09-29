"use client";
import { Fragment, useEffect, useRef } from "react";

import { usePhoneStore } from "@/hooks/use-phone";
import { useLeadStore } from "@/hooks/lead/use-lead";

import { Dialog, Transition } from "@headlessui/react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { PhoneLeadInfo } from "@/components/phone/addins/lead-info";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { LeadDialerCard } from "./lead-card";
import { DialerMenu } from "./menu";

import { pipelineUpdateByIdIndex } from "@/actions/user/pipeline";

export const PhoneDialerModal = () => {
  const {
    isPhoneDialerOpen,
    onSetLead,
    onSetIndex,
    leads,
    lead,
    pipeline,
    pipeIndex: pipIndex,
  } = usePhoneStore();
  const { setLeadId: setLead } = useLeadStore();

  const indexRef = useRef<HTMLDivElement>(null);

  const setIndex = (number: number = 0) => {
    let idx = number == 0 ? 0 : pipIndex + number;
    onSetIndex(idx);
    if (!leads) return;
    onSetLead(leads[idx]);
    setLead(leads[idx].id);
    pipelineUpdateByIdIndex({ id: pipeline?.id!, index: idx });
  };

  useEffect(() => {
    if (!leads) return;
    onSetLead(leads[pipIndex]);
    setLead(leads[pipIndex].id);
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
          <div className="flex flex-col w-full h-full overflow-hidden pointer-events-none items-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Panel className="pointer-events-auto w-full h-full overflow-hidden">
                <div className="flex flex-col justify-between gap-2 overflow-hidden h-full bg-background p-2 shadow-xl rounded-md text-sm">
                  <DialerMenu setIndex={setIndex} />

                  <ResizablePanelGroup
                    className="flex flex-1 gap-2 overflow-hidden h-full"
                    direction="horizontal"
                    autoSaveId="rpg-dailer"
                  >
                    {/* <div className="flex flex-1 gap-2 overflow-hidden h-full"> */}
                    <ResizablePanel
                      className="border border-secondary overflow-hidden h-full"
                      defaultSize={25}
                      minSize={25}
                      maxSize={30}
                    >
                      {/* <div className="border border-secondary w-1/4 overflow-hidden h-full"> */}
                      <ScrollArea className="h-full pr-2">
                        {leads.map((lead, i) => (
                          <LeadDialerCard
                            key={lead.id}
                            lead={lead}
                            indexRef={i == pipIndex ? indexRef : null}
                          />
                        ))}
                      </ScrollArea>
                      {/* </div> */}
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel
                      className="flex flex-col flex-1 border border-secondary h-full overflow-hidden"
                      defaultSize={80}
                      maxSize={80}
                    >
                      {/* <div className="flex flex-col flex-1 border border-secondary h-full overflow-hidden"> */}
                      {lead && <PhoneLeadInfo />}
                      {/* </div> */}
                    </ResizablePanel>
                    {/* </div> */}
                  </ResizablePanelGroup>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
