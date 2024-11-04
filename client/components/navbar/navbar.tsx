"use client";
import { Lobster_Two } from "next/font/google";
import { cn } from "@/lib/utils";
import { Bot, List, MessageSquarePlus, Smartphone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useChatStore } from "@/hooks/chat/use-chat";
import { useLeadStore } from "@/hooks/lead/use-lead";
import { usePhoneStore } from "@/hooks/use-phone";
import { useTodoStore } from "@/hooks/user/use-todo";

import { Badge } from "../ui/badge";
import { Button } from "@/components/ui/button";
import Hint from "../custom/hint";
import { MainNav } from "./main-nav";
import { MasterSwitch } from "./master-switch";
import { NavChat } from "./nav-chat";
import { NavMessages } from "./nav-messages";
import { usePathname } from "next/navigation";

const lobster = Lobster_Two({
  subsets: ["latin"],
  weight: ["400", "700"],
});
type Props = {
  admin?: boolean;
};

const NavBar = ({ admin = false }: Props) => {
  const { onPhoneOutOpen, isOnCall, lead } = usePhoneStore();
  const { setLeadId } = useLeadStore();
  const { isChatOpen, onChatOpen, masterUnread } = useChatStore();
  const { isTodosOpen, onTodosOpen } = useTodoStore();
  const pathname=usePathname();
  const isDisabled=pathname.startsWith("/chat")

  return (
    <div
      className={cn(
        "flex items-center px-3 gap-2 py-1 border-b border-primary shrink-0",
        admin ? "bg-primary/25" : "bg-background/80"
      )}
    >
      <a className="flex gap-1 items-center" href="/">
        <Image
          src="/logo3.png"
          alt="hyperion logo"
          width={30}
          height={30}
          className="w-[30px] aspect-square"
          priority
        />
      </a>
      <span className={cn(lobster.className, "hidden lg:block")}>Hyperion</span>
      <MainNav admin={admin} />

      <div className="flex flex-col-reverse gap-1 justify-end items-end md:flex-row flex-1 md:items-center  space-x-2">
        <div className="flex justify-end gap-2">
          <Hint label="Todos" side="bottom" align="center">
            <Button
              variant={isTodosOpen ? "default" : "outline"}
              size="icon"
              onClick={onTodosOpen}
            >
              <List size={15} />
            </Button>
          </Hint>
          {/* messages list */}
          <NavMessages />
          {/*srini- Agent chat */}
          {/* //TODO - dont forget to remove if this wont be used anymore */}
          {/* <NavChat /> */}
          {/* srini- online chat button */}

          <Hint label="Agent Messages" side="bottom" align="center">
            <Button
              className="relative"
              variant={isChatOpen ? "default" : "outline"}
              size="icon"
              onClick={onChatOpen}
              disabled={isDisabled}
            >
              <Bot size={15} />
              {masterUnread > 0 && (
                <Badge className="absolute rounded-full text-xs -top-2 -right-2 p-1">
                  {masterUnread}
                </Badge>
              )}
            </Button>
          </Hint>
          <MasterSwitch />
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link
              className="flex items-center justify-center gap-2"
              href="/feedback"
            >
              <MessageSquarePlus size={16} />
              Feedback
            </Link>
          </Button>
          <Button
            variant={isOnCall ? "blue" : "default"}
            className={cn("rounded-full", isOnCall && "animate-ping")}
            size="icon"
            onClick={() => {
              setLeadId(undefined);
              onPhoneOutOpen(isOnCall ? lead : undefined);
            }}
          >
            <Smartphone size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
