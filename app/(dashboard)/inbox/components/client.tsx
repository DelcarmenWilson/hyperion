"use client";

import { useEffect, useState } from "react";
import { InboxColumn, columns } from "./columns";
import { DataTable } from "./data-table";
import { useCurrentUser } from "@/hooks/use-current-user";
import { pusherClient } from "@/lib/pusher";
import { find } from "lodash";
import { Conversation } from "@prisma/client";

type InboxClientProps = {
  convos: InboxColumn[];
};
export const InboxClient = ({ convos }: InboxClientProps) => {
  const user = useCurrentUser();
  const [conversations, setConversations] = useState<InboxColumn[]>(convos);
  useEffect(() => {
    pusherClient.subscribe(user?.id as string);

    const convoHandler = (updatedConvo: Conversation) => {
      // if (message.role == "user" && audioRef.current) {
      //   audioRef.current.play();
      // }
      setConversations((current) => {
        if (find(current, { id: updatedConvo.id })) {
          const convo = current.find((e) => e.id == updatedConvo.id);
          const index = current.findIndex((e) => e.id == updatedConvo.id);
          if (!convo) {
            return current;
          }
          convo.message = updatedConvo.lastMessage!;
          convo.updatedAt = updatedConvo.updatedAt;
          current.unshift(current.splice(index, 1)[0]);

          return [...current];
        }
        return [...current];
      });
    };
    pusherClient.bind("messages:new", convoHandler);
    return () => {
      pusherClient.unsubscribe(user?.id as string);
      pusherClient.unbind("messages:new", convoHandler);
    };
  }, [user?.id]);
  return <DataTable columns={columns} data={conversations} />;
};
