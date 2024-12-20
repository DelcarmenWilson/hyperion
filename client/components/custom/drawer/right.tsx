"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { Fragment } from "react";

type DrawerRightProps = {
  title: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  scroll?: boolean;
  children: React.ReactNode;
  size?: string;
  closeButton?: "simple" | "default";
  autoClose?: boolean;
};
export const DrawerRight = ({
  title,
  description,
  isOpen,
  onClose,
  scroll = true,
  children,
  size = "max-w-sm",
  closeButton = "default",
  autoClose = false,
}: DrawerRightProps) => {
  return (
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
                  className={cn("pointer-events-auto w-screen", size)}
                >
                  <div className="flex flex-col h-full overflow-hidden bg-background py-2 shadow-xl">
                    <div className=" flex items-center justify-between px-2">
                      <div>
                        <h2 className="font-semibold text-xl tracking-tight">
                          {title}
                        </h2>
                        {description && (
                          <p className="text-sm text-muted-foreground">
                            {description}
                          </p>
                        )}
                      </div>
                      <Button variant={closeButton} size="sm" onClick={onClose}>
                        <span className="sr-only">Close panel</span>
                        <X size={16} />
                      </Button>
                    </div>
                    {scroll ? (
                      <ScrollArea className="flex-1 h-full p-2">
                        {children}
                      </ScrollArea>
                    ) : (
                      <div className="flex flex-col flex-1 h-full p-2 overflow-hidden">
                        {children}
                      </div>
                    )}
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
