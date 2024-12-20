import { useEffect, useRef, useState } from "react";
import { MessageSquare } from "lucide-react";
import { userEmitter } from "@/lib/event-emmiter";
import axios from "axios";

import { useCurrentUser } from "@/hooks/user/use-current";
import { useLeadStore } from "@/stores/lead-store";
import { useLeadData } from "@/hooks/lead/use-lead";
import { useLeadMessageActions } from "@/hooks/lead/use-message";

import { LeadCommunication } from "@prisma/client";
import { FullMessage } from "@/types";
import { MessageType } from "@/types/message";

import { AiCard } from "./ai-card";
import { Button } from "@/components/ui/button";
import { MessageCard } from "./message-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { useSocketStore } from "@/stores/socket-store";
import { useLeadCommunicationData } from "@/hooks/lead/use-communication";
import { CallCard } from "./call-card";
import { LeadCommunicationType } from "@/types/lead";

export const SmsBody = ({
  conversationId,
}: {
  conversationId: string | undefined;
}) => {
  const { socket } = useSocketStore();
  const user = useCurrentUser();
  const { leadId } = useLeadStore();
  const { onGetLeadBasicInfo } = useLeadData();
  const { leadBasic } = onGetLeadBasicInfo(leadId as string);

  const { onGetCommunications } = useLeadCommunicationData();
  const {
    communications: initCommunications,
    communicationsFetching,
    communicationsLoading,
  } = onGetCommunications();

  const { IsPendinginitialMessage, onMessageInitialSubmit } =
    useLeadMessageActions();

  const [communications, setCommunications] = useState(initCommunications);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  //TODO - messages are not scrolling to the bottom after being inserted
  const scrollToBottom = () => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView(true);
    }, 2000);
  };
  const onSetMessage = (newCommunication: LeadCommunication) => {
    const existing = communications?.find((e) => e.id == newCommunication.id);
    if (existing != undefined) return;
    setCommunications((communications) => [
      ...communications!,
      newCommunication,
    ]);
    scrollToBottom();
  };

  useEffect(() => {
    if (conversationId) {
      axios.post(`/api/conversations/${conversationId}/seen`);
      userEmitter.emit("conversationSeen", conversationId as string);
    }
    scrollToBottom();
    userEmitter.on("communicationInserted", (info) => onSetMessage(info));
    return () => {
      userEmitter.off("communicationInserted", (info) => onSetMessage(info));
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const messageHandler = (message: LeadCommunication) => {
      axios.post(`/api/conversations/${conversationId}/seen`);
      onSetMessage(message);
    };
    socket?.on("conversation-messages-new", (data: { dt: FullMessage[] }) => {
      data.dt.forEach((message) => messageHandler(message));
    });
    return () => {
      socket?.off(
        "conversation-messages-new",
        (data: { dt: FullMessage[] }) => {
          data.dt.forEach((message) => messageHandler(message));
        }
      );
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!initCommunications) return;
    setCommunications(initCommunications);
    scrollToBottom();
  }, [initCommunications]);

  return (
    <ScrollArea className="flex flex-col flex-1 px-4">
      <div
        ref={chatContainerRef}
        className="flex flex-1 flex-col h-full w-full"
      >
        <SkeletonWrapper isLoading={communicationsFetching} fullHeight>
          {!leadId && (
            <div className="flex-center flex-col text-muted-foreground h-full gap-2">
              <p className="font-bold">Please slect a lead to message</p>
            </div>
          )}

          {leadId && !communications?.length && (
            <div className="flex-center flex-col text-muted-foreground h-full gap-2">
              <p className="font-bold">No sms have been sent</p>
              <Button
                className="gap-2"
                disabled={IsPendinginitialMessage}
                variant="outlineprimary"
                onClick={onMessageInitialSubmit}
              >
                <MessageSquare size={16} />
                Send an initial message
              </Button>
              <p>- OR -</p>
              <p className="mt-2"> Type a message below</p>
            </div>
          )}
          {communications?.map((communication) => (
            <>
              {communication.type == LeadCommunicationType.SMS ? (
                <>
                  {communication.from === MessageType.AI ? (
                    <AiCard
                      key={communication.id}
                      id={communication.id}
                      body={communication.content as string}
                      createdAt={communication.createdAt}
                    />
                  ) : (
                    <MessageCard
                      key={communication.id}
                      id={communication.id}
                      body={communication.content}
                      attachment={communication.attachment}
                      role={communication.role}
                      status={communication.status}
                      from={communication.from}
                      createdAt={communication.createdAt}
                      username={
                        communication.role === "user"
                          ? leadBasic?.firstName!
                          : user?.name!
                      }
                    />
                  )}
                </>
              ) : (
                <CallCard
                  key={communication.id}
                  direction={communication.direction}
                  type={communication.type}
                  status={communication.status}
                  duration={communication.duration || 0}
                  recordUrl={communication.recordUrl as string}
                  createdAt={communication.createdAt}
                />
              )}
            </>
          ))}
          <div ref={bottomRef} className="pt-2" />
        </SkeletonWrapper>
      </div>
    </ScrollArea>
  );
  // return (
  //   <ScrollArea className="w-full h-full px-5">
  //     <div
  //       ref={chatContainerRef}
  //       className="flex flex-1 flex-col h-full w-full"
  //     >
  //       <SkeletonWrapper isLoading={isFetchingMessages} fullHeight>
  //         {!messages?.length ? (
  //           <div className="flex-center flex-col text-muted-foreground h-full gap-2">
  //             <p className="font-bold">No sms have been sent</p>
  //             <Button
  //               className="gap-2"
  //               disabled={IsPendinginitialMessage}
  //               variant="outlineprimary"
  //               onClick={onMessageInitialSubmit}
  //             >
  //               <MessageSquare size={16} />
  //               Send an initial message
  //             </Button>
  //             <p>- OR -</p>
  //             <p className="mt-2"> Type a message below</p>
  //           </div>
  //         ) : (
  //           <>
  //             {messages?.map((message) => (
  //               <MessageCard
  //                 key={message.id}
  //                 message={message}
  //                 username={
  //                   message.role === "user"
  //                     ? leadBasic?.firstName!
  //                     : user?.name!
  //                 }
  //               />
  //             ))}
  //           </>
  //           // </ScrollArea>
  //         )}
  //       </SkeletonWrapper>
  //     </div>
  //   </ScrollArea>
  // );
};
