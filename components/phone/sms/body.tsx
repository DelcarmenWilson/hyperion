import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@prisma/client";
import { MessageCard } from "./message-card";
import { pusherClient } from "@/lib/pusher";
import { useEffect, useRef } from "react";

type SmsBodyProps = {
  messages?: Message[];
  leadName: string;
  userName: string;
};

export const SmsBody = ({ messages, leadName, userName }: SmsBodyProps) => {
  // const [messages] = useState(initialMessages);

  const bottomRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   bottomRef?.current?.scrollIntoView();
  // }, [messages]);
  return (
    <div className="w-full flex flex-col items-center ">
      <div className="flex flex-col items-center h-[300px] w-full">
        {/* <ScrollArea className="flex flex-col flex-1 w-full rounded-sm p-4 overflow-hidden overflow-y-auto "> */}
        <div className="flex flex-col flex-1 w-full px-4 overflow-hidden overflow-y-auto">
          {!messages?.length && (
            <p className="text-center text-muted-foreground">
              No sms have been sent
            </p>
          )}
          {messages?.map((message) => (
            <MessageCard
              key={message.id}
              data={message}
              username={message.role === "user" ? leadName : userName}
            />
          ))}
          <div ref={bottomRef} className="pt-24" />
        </div>
        {/* </ScrollArea> */}
      </div>
    </div>
  );
};
