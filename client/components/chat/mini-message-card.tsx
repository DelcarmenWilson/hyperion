"use client";
import React, { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useMiniMessageData,
  useMiniMessageFormActions,
  useMiniMessageStore,
} from "@/hooks/chat/use-mini-message";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import QuillEditorSm from "@/components/custom/quill-editor-sm";
import Renderer from "@/components/global/message/renderer";
import { TimerBar } from "../global/time-bar";

export const MiniMessageCard = () => {
  const [hover, setHover] = useState(false);
  const { messageId, isMiniMessageOpen, onMiniMessageClose } =
    useMiniMessageStore();
  const { onChatMessageGet } = useMiniMessageData();
  const { message, messageFetching, messageLoading } = onChatMessageGet();
  const { handleSumbit, miniMessageInserting, editorRef, onTyping } =
    useMiniMessageFormActions(
      message?.chatId as string,
      message?.sender.id as string
    );

  const avatarFallback = message?.sender.userName?.charAt(0).toUpperCase();
  if (!messageId) return null;
  return (
    <div
      onMouseEnter={() => setHover(true)}
      className={cn(
        "fixed bottom-15 transition-[right] -right-full ease-in-out duration-500 w-full lg:w-[300px] z-[100] overflow-hidden",
        isMiniMessageOpen && "right-10"
      )}
    >
      <div className="relative flex flex-col bg-background  border border-primary w-full gap-2 p-2 rounded-sm ">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-sm">New Message</span>
          <Button variant="simple" size="icon" onClick={onMiniMessageClose}>
            <X size={16} />
          </Button>
        </div>
        <div className="flex items-start gap-2">
          <Avatar className="rounded-full">
            <AvatarImage
              className="rounded-full"
              src={message?.sender.image as string}
            />
            <AvatarFallback className="rounded-full bg-primary/50 text-xs">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <p>{message?.sender.userName}</p>
        </div>
        <div className=" font-semibold truncate overflow-hidden text-sm text-center">
          <Renderer value={message?.body} />
        </div>
        <QuillEditorSm
          key={message?.id}
          placeholder="Type a reply"
          onSubmit={handleSumbit}
          disabled={miniMessageInserting}
          innerRef={editorRef}
          onTyping={onTyping}
        />
        <div className="absolute bottom-2 w-full pe-3">
          {/* TODO - need to add the onclose function. it was giving me an erro when closing the popup automatically. */}
          <TimerBar hover={hover} hold={messageFetching} />
        </div>
      </div>
    </div>
  );
};
