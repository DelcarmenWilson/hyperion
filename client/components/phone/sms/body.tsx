import { useContext, useEffect, useRef } from "react";
import { MessageSquare } from "lucide-react";
import SocketContext from "@/providers/socket";
import { userEmitter } from "@/lib/event-emmiter";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCard } from "./message-card";
import { useLeadMessageActions } from "@/hooks/lead/use-message";
import SkeletonWrapper from "@/components/skeleton-wrapper";

type SmsBodyProps = {
  leadName: string;
  userName: string;
};

export const SmsBody = ({ leadName, userName }: SmsBodyProps) => {
  const { socket } = useContext(SocketContext).SocketState;
  // const [messages, setMessages] = useState(initMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isFetchingMessages,
    onMessageInitialSubmit,
    IsPendinginitialMessage,
  } = useLeadMessageActions();

  //TODO - messages are not scrolling to the bottom after being inserted
  const ScrollDown = () => {
    if (bottomRef.current) {
      const parent = bottomRef.current.parentElement?.parentElement;
      const top = bottomRef.current.offsetTop;
      parent?.scrollTo({ top, behavior: "smooth" });
    }
  };

  // const onSetMessage = (newMessage: LeadMessage) => {
  //   const existing = messages?.find((e) => e.id == newMessage.id);
  //   if (existing != undefined) return;
  //   if (!conversationId) {
  //     setConversationId(newMessage.conversationId);
  //   }
  //   setMessages((messages) => [...messages!, newMessage]);
  //   ScrollDown();
  // };

  // useEffect(() => {
  //   if (conversationId) {
  //     axios.post(`/api/conversations/${conversationId}/seen`);
  //     userEmitter.emit("conversationSeen", conversationId as string);
  //   }
  //   ScrollDown();
  //   userEmitter.on("messageInserted", (info) => onSetMessage(info));
  //   return () => {
  //     userEmitter.off("messageInserted", (info) => onSetMessage(info));
  //   };
  //   // eslint-disable-next-line
  // }, []);

  // useEffect(() => {
  //   const messageHandler = (message: LeadMessage) => {
  //     axios.post(`/api/conversations/${conversationId}/seen`);
  //     onSetMessage(message);
  //   };
  //   socket?.on("conversation-messages-new", (data: { dt: FullMessage[] }) => {
  //     data.dt.forEach((message) => messageHandler(message));
  //   });
  //   return () => {
  //     socket?.off(
  //       "conversation-messages-new",
  //       (data: { dt: FullMessage[] }) => {
  //         data.dt.forEach((message) => messageHandler(message));
  //       }
  //     );
  //   };
  //   // eslint-disable-next-line
  // }, []);

  return (
    <SkeletonWrapper isLoading={isFetchingMessages} fullHeight>
      {!messages?.length ? (
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
      ) : (
        <ScrollArea className="w-full h-full">
          {messages?.map((message) => (
            <MessageCard
              key={message.id}
              message={message}
              username={message.role === "user" ? leadName : userName}
            />
          ))}
          <div ref={bottomRef} className="pt-2" />
        </ScrollArea>
      )}
    </SkeletonWrapper>
  );
};
