import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sparkle, X } from "lucide-react";
import React from "react";
import ChatBotFormInput from "./form-input";
import { usePublicChatbotData } from "./hooks/use-chatbot";
import { PublicChatbotConversationBody } from "./body";

type Props = {
  open: boolean;
  onClose: () => void;
};
export const ChatBotForm = ({ open, onClose }: Props) => {
  const { onConversationDelete, IsPendingDeleteConversation } =
    usePublicChatbotData();
  return (
    <div
      className={cn(
        "absolute hidden flex-col gap-1 bg-background w-[calc(100%-0.5rem)] h-full border border-primary/50 rounded-sm transition-[bottom] -bottom-full ease-in-out duration-500 focus-within:border-primary",
        open && "flex bottom-0 "
      )}
    >
      <div className="flex justify-between items-center border-b">
        <span className="flex justify-between items-centerfont-bold text-sm ps-2">
          <Sparkle size={15} />
          Titan
        </span>
        <Button size="sm" onClick={onConversationDelete}>
          New Convo
        </Button>

        <Button size="icon" variant="ghost" onClick={onClose}>
          <X size={15} />
        </Button>
      </div>
      {/* body */}
      <PublicChatbotConversationBody />
      {/* form */}
      <ChatBotFormInput placeholder="type something please...." />
    </div>
  );
};
