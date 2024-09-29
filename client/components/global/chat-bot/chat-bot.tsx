"use client";
import { Sparkle } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../../ui/button";
import { ChatBotForm } from "./form";
import { cn } from "@/lib/utils";
import { usePublicChatbotData } from "./hooks/use-chatbot";

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const { onChatbotConversationInsert } = usePublicChatbotData();
  const onOpenChat = () => {
    onChatbotConversationInsert();
    setOpen(true);
  };
  return (
    <div
      className={cn(
        "fixed text-black bottom-4 right-4 p-2 transition-[width] ease-in-out duration-500 overflow-hidden z-50 w-auto h-auto ",
        open && "w-full h-[600px] lg:w-[300px] lg:h-[400px]"
      )}
    >
      <div
        className={cn(
          "flex-center rounded-full bg-background border border-primary p-2 w-fit"
        )}
      >
        <Button
          variant="outlineprimary"
          size="icon"
          className="rounded-full"
          onClick={onOpenChat}
        >
          <Sparkle size={25} />
        </Button>
      </div>
      <ChatBotForm open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default ChatBot;
