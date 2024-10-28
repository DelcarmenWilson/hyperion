"use client";

import { Fragment } from "react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";

type Props = {
  title: string;
  menu?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  scroll?: boolean;
  children: React.ReactNode;
  sideDrawer: React.ReactNode;
  sideDrawerOpen: boolean;
  size?: string;
  closeButton?: "simple" | "default";
  autoClose?: boolean;
};
export const DrawerExtendedSm = ({
  title,
  menu,
  isOpen,
  onClose,
  children,
  sideDrawer,
  sideDrawerOpen,
  size = "w-auto",
  closeButton = "default",
  autoClose = false,
}: Props) => {
  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => {
            if (autoClose) onClose();
          }}
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
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute indent-0 overflow-hidden">
              <div className="flex fixed inset-y-0 right-[350px] max-w-full">
                {/* <div className="flex flex-1 justify-start relative overflow-hidden"> */}
                <div
                  className={cn(
                    "flex flex-1 relative transition-[all] -right-full bg-background ease-in-out duration-600 h-full w-full overflow-hidden opacity-0",
                    sideDrawerOpen && "right-0 opacity-100"
                  )}
                >
                  {sideDrawer}
                </div>
                {/* </div> */}
              </div>
              <div className="fixed pointer-events-none inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel
                    className={cn("pointer-events-auto w-[350px]", size)}
                  >
                    <div className="flex flex-col h-full overflow-hidden bg-background  py-2 shadow-xl">
                      <div className=" flex items-center justify-between px-2">
                        <div className="flex justify-center items-center gap-2">
                          <h2 className="font-semibold text-xl tracking-tight">
                            {title}
                          </h2>

                          {menu}
                        </div>

                        <Button
                          variant={closeButton}
                          size="sm"
                          onClick={onClose}
                        >
                          <span className="sr-only">Close panel</span>
                          <X size={16} />
                        </Button>
                      </div>
                      <div className="flex flex-col w-[350px] flex-1 h-full p-2 overflow-hidden">
                        {children}
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};
