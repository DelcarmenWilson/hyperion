"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import { LeadConversationType } from "@/types";
import { Heading } from "@/components/custom/heading";
import { buttonVariants } from "@/components/ui/button";
import { ConversationBox } from "./conversation-box";

interface ConversationListProps {
  initialData: LeadConversationType[];
}

export const ConversationList = ({ initialData }: ConversationListProps) => {
  const [items, setItems] = useState(initialData);
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="flex flex-col  lg:space-y-1 py-2 px-1">
      {initialData?.map((item) => (
        <ConversationBox
          key={item.id}
          data={item}
          selected={pathname === `/conversations/${item.id}`}
        />
        // <Link
        //   key={convo.id}
        //   href={`/conversations/${convo.id}`}
        //   className={cn(
        //     buttonVariants({
        //       variant:
        //         pathname === `/conversations/${convo.id}` ? "default" : "ghost",
        //     }),
        //     "flex justify-between overflow-hidden w-100 h-auto mb-2 pr-2"
        //   )}
        // >
        //   <div className="flex justify-center items-center bg-primary text-accent dark:bg-accent dark:text-primary  rounded-full p-1 mr-2">
        //     <span className="text-lg font-semibold">
        //       {convo.lead.firstName.substring(0, 1)}{" "}
        //       {convo.lead.lastName.substring(0, 1)}
        //     </span>
        //   </div>
        //   <div className="block flex-1 truncate">
        //     <div className="text-lg">
        //       {convo.lead.firstName} {convo.lead.lastName}
        //     </div>
        //     <span className="text-muted-foreground ">{convo.lastMessage}</span>
        //   </div>
        // </Link>
      ))}
    </aside>
  );
};
