"use client";
import { Fragment } from "react";

import { Dialog, Transition } from "@headlessui/react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};
export const PageNotification = ({ isOpen, onClose }: Props) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50 pointer-events-none"
        onClose={onClose}
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
                  THIS IS A MODAL FOR THE PAGE NOTIFICATIONS
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
