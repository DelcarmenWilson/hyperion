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
import { ChatMessageSchemaType } from "@/schemas/chat";
import { chatMessageGetById, chatMessageInsert } from "@/actions/chat/message";

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
      queryFn: () => chatMessageGetById(messageId as string),
      queryKey: [`chat-message-${messageId}`],
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
      mutationFn: chatMessageInsert,
      onSuccess: (results) => {
        if (results.success) {
          invalidateMultiple([`chat-${results.success.chatId}`, "full-chats"]);
          socket?.emit("chat-message-sent", agentId, results.success);
          toast.success("Chat message created", { id: "insert-chat-message" });
          onMiniMessageClose();
        } else toast.error(results.error);
      },
      onError: (error) =>
        toast.error(error.message, { id: "insert-chat-message" }),
    });

  const onChatMessageInsert = useCallback(
    (values: ChatMessageSchemaType) => {
      toast.loading("Creating new message ...", { id: "insert-chat-message" });
      miniMessageInsertMutate(values);
    },
    [miniMessageInsertMutate]
  );

  const onTyping = () => {
    socket?.emit("chat-is-typing-sent", agentId, user?.id);
  };

  const handleSumbit = ({ body }: { body: Delta }) => {
    const message: ChatMessageSchemaType = {
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
