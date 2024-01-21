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
    <aside className="flex flex-col w-[250px] lg:space-y-1 py-2 px-1">
      {initialData?.map((item) => (
        <ConversationBox
          key={item.id}
          data={item}
          selected={pathname === `/inbox/${item.id}`}
        />
      ))}
    </aside>
  );
};
