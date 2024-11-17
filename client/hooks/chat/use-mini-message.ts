import { useCallback, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { create } from "zustand";
import { useCurrentUser } from "../user/use-current";
import { useSocketStore } from "../use-socket-store";
import { useInvalidate } from "../use-invalidate";
import { toast } from "sonner";
import Quill from "quill";
import { Delta } from "quill/core";

import { FullMiniMessage } from "@/types";
import {  CreateChatMessageSchemaType } from "@/schemas/chat";
import { getMessage } from "@/actions/chat/message/get-message";
import { createMessage } from "@/actions/chat/message/create-message";


type State = {
  messageId?: string;
  isMiniMessageOpen: boolean;
};
type Actions = {
  onMiniMessageOpen: (m: string) => void;
  onMiniMessageClose: () => void;
};

export const useMiniMessageStore = create<State & Actions>((set) => ({
  //  messageId: "cm30nyurz001587wugvl5np8f",
  isMiniMessageOpen: false,
  onMiniMessageOpen: (m) => set({ isMiniMessageOpen: true, messageId: m }),
  onMiniMessageClose: () => set({ isMiniMessageOpen: false, messageId: undefined }),
}));

export const useMiniMessageData = () => {
  const { messageId } = useMiniMessageStore();

  //MINI MESSAGE CARD
  const onChatMessageGet = () => {
    const {
      data: message,
      isFetching: messageFetching,
      isLoading: messageLoading,
    } = useQuery<FullMiniMessage | null>({
      queryFn: () => getMessage(messageId as string),
      queryKey: [`chat-message-${messageId}`],
      enabled:!!messageId
    });
    return { message, messageFetching, messageLoading };
  };

  return {
    onChatMessageGet,
  };
};

export const useMiniMessageFormActions = (chatId: string, agentId: string) => {
  const { socket } = useSocketStore();
  const editorRef = useRef<Quill | null>(null);
  const { invalidateMultiple } = useInvalidate();
  const {  onMiniMessageClose } = useMiniMessageStore();
  const user = useCurrentUser();

  // INSERT MESSAGE
  const { mutate: miniMessageInsertMutate, isPending: miniMessageInserting } =
    useMutation({
      mutationFn: createMessage,
      onSuccess: (results) => {
     
          invalidateMultiple([`chat-${results.chatId}`, "full-chats"]);
          socket?.emit("chat-message-sent", agentId, results);
          onMiniMessageClose();
     
      },
      onError: (error) =>
        toast.error(error.message, { id: "insert-chat-message" }),
    });

  const onChatMessageInsert = useCallback(
    (values: CreateChatMessageSchemaType) => {
      miniMessageInsertMutate(values);
    },
    [miniMessageInsertMutate]
  );

  const onTyping = () => {
    socket?.emit("chat-is-typing-sent", agentId, user?.id);
  };

  const handleSumbit = ({ body }: { body: Delta }) => {
    const message: CreateChatMessageSchemaType = {
      chatId,
      body: JSON.stringify(body),
      image: undefined,
      senderId: user?.id!,
    };
    onChatMessageInsert(message);
  };

  return {
    handleSumbit,
    miniMessageInserting,
    editorRef,
    onTyping,
  };
};
