import { useCallback, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  FullPublicChatbotConversation,
} from "@/types";

import {
  publicChatbotConversationDeleteById,
  publicChatbotConversationGetById,
  publicChatbotConversationInsert,
  publicChatbotMessageInsert,
} from "@/actions/chat-bot/public-chatbot";

import {
  PublicChatbotMessageSchemaType,
} from "@/schemas/chat-bot/publicchatbot";

import { PublicChatbotMessage } from "@prisma/client";
import { usePublicChatbotStore, usePublicConversationAtom } from "@/stores/public-chatbot-store";




export const usePublicChatbotData = () => {
  const [store, setConversationId] = usePublicConversationAtom();
  const { setMessages } = usePublicChatbotStore();

  const queryClient = useQueryClient();

  const { data: conversation, isFetching: isFetchingConversation } =
    useQuery<FullPublicChatbotConversation | null>({
      queryFn: () =>
        publicChatbotConversationGetById(store.conversationId as string),
      queryKey: [`public-chatbot-conversation-${store.conversationId}`],
    });

  const onChatbotConversationInsert = async () => {
    if (store.conversationId) {
      return;
    }
    const insertedConversation = await publicChatbotConversationInsert();
    if (insertedConversation.success) {
      setConversationId({
        conversationId: insertedConversation.success,
      });
      queryClient.invalidateQueries({
        queryKey: ["public-chatbot-conversations"],
      });
    } else toast.error(insertedConversation.error);
  };

  //INERT NEW MESSAGE
  const {
    mutate: deleteConversationMutate,
    isPending: IsPendingDeleteConversation,
  } = useMutation({
    mutationFn: publicChatbotConversationDeleteById,

    onSuccess: (results) => {
      if (results.success) {
        setConversationId({ conversationId: undefined });
        onChatbotConversationInsert();
        toast.success("New Conversation started!", {
          id: "start-new-conversation",
        });
      } else {
        toast.error(results.error, { id: "start-new-conversation" });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onConversationDelete = useCallback(() => {
    toast.loading("Starting a new Conversation..", {
      id: "start-new-conversation",
    });
    deleteConversationMutate(store.conversationId!);
  }, [deleteConversationMutate, store.conversationId]);

  useEffect(() => {
    if (!conversation) return;
    setMessages(conversation.messages);
  }, [conversation, store.conversationId]);

  return {
    conversation,
    isFetchingConversation,
    onChatbotConversationInsert,
    onConversationDelete,
    IsPendingDeleteConversation,
  };
};

export const usePublicChatBotActions = () => {
  const [store] = usePublicConversationAtom();
  const { addMessage, setIsTyping } = usePublicChatbotStore();
  const queryClient = useQueryClient();

  const toggleTyping = (m: PublicChatbotMessage) => {
    const words = m.content.split(" ");
    const wpm = 38;
    const delay = Math.round(words.length / wpm) + 2000;
    setTimeout(() => {
      setIsTyping();
    }, 2000);
    setTimeout(() => {
      addMessage(m);
      setIsTyping();
    }, delay);
  };

  //INERT NEW MESSAGE
  const { mutate: insertMessageMutate, isPending: IsPendingInsertMessage } =
    useMutation({
      mutationFn: publicChatbotMessageInsert,

      onSuccess: (results) => {
        if (results.success) {
          addMessage(results.success[0]);
          toggleTyping(results.success[1]);
          // toast.success("message sent!", { id: "insert-message" });
        } else {
          toast.error(results.error, { id: "insert-message" });
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onMessageInsertSubmit = useCallback(
    (values: PublicChatbotMessageSchemaType) => {
      // toast.loading("Sending Message..", { id: "insert-message" });
      values.conversationId = store.conversationId!;
      insertMessageMutate(values);
    },
    [insertMessageMutate, store.conversationId]
  );

  return {
    onMessageInsertSubmit,
    IsPendingInsertMessage,
  };
};
