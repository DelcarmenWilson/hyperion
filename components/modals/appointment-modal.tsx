"use client";
import { Fragment } from "react";
import { X } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";

import { Button } from "@/components/ui/button";
import { useAppointmentModal } from "@/hooks/use-appointment-modal";
import { AppointmentForm } from "@/components/custom/appointment-form";

export const AppointmentModal = () => {
  const appointmentModel = useAppointmentModal();

  return (
    <Transition.Root show={appointmentModel.isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
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
                <Dialog.Panel className="pointer-events-auto w-[400px] max-w-screen-2xl">
                  <div className="flex flex-col h-full overflow-y-auto bg-background py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        New Appoinment
                        <div className="flex items-center ml-3">
                          <Button size="xs" onClick={appointmentModel.onClose}>
                            <span className="sr-only">Close panel</span>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <AppointmentForm />
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
