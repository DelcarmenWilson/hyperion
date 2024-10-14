import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useChatStore, useChatData } from "@/hooks/use-chat";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "@/components/ui/button";
import { MessageCard } from "./message";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { cn } from "@/lib/utils";

export const ChatBody = () => {
  const currentUser = useCurrentUser();
  const { user, chatId } = useChatStore();
  const bottomRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loaded, setLoaded] = useState(true);

  const { chat, chatIsFetching } = useChatData(chatId as string);

  // handles the animation when scrolling to the top
  const scrollToBottom = (type: boolean = false) => {
    bottomRef.current?.scrollIntoView({
      behavior: type ? "smooth" : loaded ? "instant" : "smooth",
    });
  };

  useEffect(() => {
    if (chatIsFetching) return;
    scrollToBottom();
    setLoaded(true);
  }, [user?.id, chatIsFetching]);

  useEffect(() => {
    if (!parentRef.current) return;
    const toggleVisibility = () => {
      const height = parentRef.current?.scrollHeight! - 800;
      const scrolled = parentRef.current?.scrollTop!;
      // if the user scrolls up, show the button
      scrolled < height - 800 ? setIsVisible(true) : setIsVisible(false);
    };
    // listen for scroll events
    parentRef.current?.addEventListener("scroll", toggleVisibility);

    // clear the listener on component unmount
    return () => {
      parentRef.current?.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div className="relative flex-1 border p-1 rounded overflow-hidden">
      <div
        ref={parentRef}
        className="flex flex-col h-full gap-2 overflow-y-auto px-2"
      >
        <SkeletonWrapper isLoading={chatIsFetching}>
          {chat?.messages?.map((message) => (
            <MessageCard
              key={message.id}
              username={message.sender.userName}
              content={message.content!}
              createdAt={message.createdAt}
              isOwn={currentUser?.id == message.senderId}
            />
          ))}
          <div className="p-2" ref={bottomRef}></div>
        </SkeletonWrapper>
      </div>
      <Button
        className={cn(
          "absolute bottom-2 right-6 opacity-0",
          isVisible && "opacity-100"
        )}
        onClick={() => scrollToBottom(true)}
        size="icon"
      >
        <ChevronDown size={16} />
      </Button>
    </div>
  );
};
