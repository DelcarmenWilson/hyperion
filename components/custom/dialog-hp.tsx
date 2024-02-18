"use client";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

type DialogHpProps = {
  isOpen: boolean;
  children: React.ReactNode;
};

export const DialogHp = ({ isOpen, children }: DialogHpProps) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
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
        <div className="fixed inset-0 overflow-hidden pointer-events-none ">
          <div className="flex justify-center items-center w-full h-full overflow-hidden pointer-events-none ">
            <div className="pointer-events-none">
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
                  <div className="flex flex-col gap-2 overflow-y-auto bg-white p-2 shadow-xl rounded-md text-sm">
                    {children}
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
