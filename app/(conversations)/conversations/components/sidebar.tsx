"use client";
import { Heading } from "@/components/custom/heading";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Conversation, Lead } from "@prisma/client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  initialData:
    | (Conversation & {
        lead: Lead;
      })[]
    | null;
}

export const Sidebar = ({ initialData }: SidebarProps) => {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col  lg:space-y-1 p-2">
      {initialData?.map((convo) => (
        <Link
          key={convo.id}
          href={`/conversations/${convo.id}`}
          className={cn(
            buttonVariants({
              variant:
                pathname === `/conversations/${convo.id}` ? "default" : "ghost",
            }),
            "items-start overflow-clip flex-col h-auto mb-2 truncate"
          )}
        >
          <span className="text-lg">
            {convo.lead.firstName} {convo.lead.lastName}
          </span>
          <p className="text-muted-foreground">{convo.lastMessage}</p>
        </Link>
      ))}
    </nav>
  );
};
