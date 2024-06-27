"use client";

import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { MessagesSquare } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";

import { ShortConvo } from "@/types";
import { PageLayout } from "@/components/custom/layout/page-layout";
import { DataTable } from "./data-table";
import { InboxColumn, columns } from "./columns";

type InboxClientProps = {
  convos: InboxColumn[];
};
export const InboxClient = ({ convos }: InboxClientProps) => {
  const user = useCurrentUser();
  const [conversations, setConversations] = useState<InboxColumn[]>(convos);
  useEffect(() => {
    pusherClient.subscribe(user?.id as string);

    const convoHandler = (updatedConvo: ShortConvo) => {
      setConversations((current) => {
        const convo = current.find((e) => e.id == updatedConvo.id);
        if (convo) {
          const index = current.findIndex((e) => e.id == updatedConvo.id);
          convo.message = updatedConvo.lastMessage?.content!;
          convo.updatedAt = updatedConvo.updatedAt;
          current.unshift(current.splice(index, 1)[0]);

          return [...current];
        }
        return current;
      });
    };
    pusherClient.bind("messages:new", convoHandler);
    return () => {
      pusherClient.unsubscribe(user?.id as string);
      pusherClient.unbind("messages:new", convoHandler);
    };
  }, [user?.id]);
  return (
    <PageLayout title="View Inbox" icon={MessagesSquare}>
      <DataTable columns={columns} data={conversations} />{" "}
    </PageLayout>
  );
};
