"use client";

import { Fragment, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChat } from "@/hooks/use-chat";

import { Button } from "@/components/ui/button";
import { Dialog, Transition } from "@headlessui/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { ChatList } from "./list";
import { ChatInfo } from "./info";
import { GroupDialog } from "./group-dialog";

type Props = {
  size?: string;
  closeButton?: "simple" | "default";
  autoClose?: boolean;
};
export const ChatDrawer = ({
  size = "w-auto",
  closeButton = "default",
  autoClose = false,
}: Props) => {
  const { isChatOpen, onChatClose } = useChat();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <GroupDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <Transition.Root show={isChatOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => {
            if (autoClose) onChatClose();
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
                <ChatInfo />
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
                    className={cn("pointer-events-auto w-screen", size)}
                  >
                    <div className="flex flex-col h-full overflow-hidden bg-background  py-2 shadow-xl">
                      <div className=" flex items-center justify-between px-2">
                        <div className="flex justify-center items-center gap-2">
                          <h2 className="font-semibold text-xl tracking-tight">
                            Agents
                          </h2>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <ChevronDown size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setIsOpen(true)}>
                                Group Message
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <Button
                          variant={closeButton}
                          size="sm"
                          onClick={onChatClose}
                        >
                          <span className="sr-only">Close panel</span>
                          <X size={16} />
                        </Button>
                      </div>
                      <div className="flex flex-col w-[350px] flex-1 h-full p-2 overflow-hidden">
                        <ChatList />
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
