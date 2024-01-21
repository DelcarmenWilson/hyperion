"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { Fragment } from "react";
import { NewLeadForm } from "./new-lead-form";

interface NewLeadDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}
export const NewLeadDrawer = ({ isOpen, onClose }: NewLeadDrawerProps) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute indent-0 overflow-hidden">
            <div className="fixed pointer-events-none inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-sm">
                  <div className="flex flex-col h-full overflow-y-auto bg-white py-2 shadow-xl">
                    <div className="px-2 sm:px-2">
                      <div className="flex items-start justify-end">
                        <div className="flex h-7 items-center">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={onClose}
                          >
                            <span className="sr-only">Close panel</span>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <ScrollArea className="flex-1 p-2">
                      <NewLeadForm onClose={onClose} />
                    </ScrollArea>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
