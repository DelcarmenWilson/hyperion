"use client";
import { Fragment } from "react";

import { usePhoneStore } from "@/stores/phone-store";
import { usePipelineStore } from "@/stores/pipeline-store";

import { Dialog, Transition } from "@headlessui/react";
import { DialerMenu } from "./menu";
import { PhoneLeadInfo } from "@/components/phone/addins/lead-info";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { updatePipelineIndex } from "@/actions/user/pipeline";
import { LeadList } from "./lead-list";
import { SmsDrawer } from "./sms-drawer";
import DialpadDialog from "./dialpad-dialog";

export const PhoneDialerModal = () => {
  const { isPhoneDialerOpen, lead } = usePhoneStore();
  const { onSetIndex, pipeIndex, selectedPipeline } = usePipelineStore();

  const setIndex = (number: number = 0) => {
    const index = number == 0 ? 0 : pipeIndex + number;
    onSetIndex(index);
    updatePipelineIndex({ id: selectedPipeline?.id!, index });
  };

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

        <div className="fixed inset-0 flex flex-col w-full h-full overflow-hidden pointer-events-none items-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Panel className="pointer-events-auto w-full flex flex-col justify-between gap-2 overflow-hidden h-full bg-background p-2 shadow-xl rounded-md text-sm">
              <DialerMenu setIndex={setIndex} />

              <ResizablePanelGroup
                className="flex flex-1 gap-2 overflow-hidden h-full"
                direction="horizontal"
                autoSaveId="rpg-dailer"
              >
                <ResizablePanel
                  className="border border-secondary overflow-hidden h-full"
                  defaultSize={25}
                  minSize={25}
                  maxSize={30}
                >
                  <LeadList />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel
                  className="flex flex-col flex-1 border border-secondary h-full overflow-hidden"
                  defaultSize={80}
                  maxSize={80}
                >
                  {lead && <PhoneLeadInfo leadId={lead.id} />}

                  <SmsDrawer />
                  {/* <DialpadDialog /> */}
                </ResizablePanel>
              </ResizablePanelGroup>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
