import {  useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { create } from "zustand";
import { useRouter } from "next/navigation";
import { FullChatbotConversation, ShortChatbotConversation } from "@/types";

import {
  chatbotConversationGetById,
  chatbotConversationInsert,
  chatbotConversationsGet,
  chatbotGetActive,
  chatbotSettingsUpsert,
} from "@/actions/chat-bot/chatbot";
import {
  ChatbotSettingsSchema,
  ChatbotSettingsSchemaType,
} from "@/schemas/chat-bot/chatbot";

type useChatbotStore = { 
  chatId?: string;
  setChatId: (c?: string) => void;
};

export const useChatbot = create<useChatbotStore>((set) => ({
  setChatId: (c) => set({ chatId: c }),
}));

export const useChatbotData = () => {
  const { chatId,setChatId } = useChatbot();
  const queryClient=useQueryClient()
  const [conversations, setConversations] = useState<
    ShortChatbotConversation[] | null | undefined
  >();

  const { data: initConversations, isFetching: isFetchingConversations } =
    useQuery<ShortChatbotConversation[] | null>({
      queryFn: () => chatbotConversationsGet(),
      queryKey: ["chatbotConversations"],
    });

  const { data: conversation, isFetching: isFetchingConversation } =
    useQuery<FullChatbotConversation | null>({
      queryFn: () => chatbotConversationGetById(chatId as string),
      queryKey: [`chatbotConversation-${chatId}`],
    });

  const onChatbotConversationInsert = async () => {
    const insertedConversation = await chatbotConversationInsert();
    if (insertedConversation.success) {
      setChatId(insertedConversation.success)
      queryClient.invalidateQueries({queryKey:["chatbotConversations"]})

    } else toast.error(insertedConversation.error);
  };

  useEffect(() => {
    setConversations(initConversations);
  }, [initConversations]);

  useEffect(() => {
    if(initConversations){
      setChatId(initConversations[0].id)
    }
  }, []);


  return {
    chatId,setChatId,
    conversations,
    isFetchingConversations,
    conversation,
    isFetchingConversation,
    onChatbotConversationInsert,
  };
};

export const useChatbotActions = (onClose: () => void) => {
  const [loading, setLoading] = useState(false);
  const { data: chatbotSettings, isFetching: isFetchingChatbotSettings } =
    useQuery<ChatbotSettingsSchemaType | null>({
      queryFn: () => chatbotGetActive(),
      queryKey: ["chatbotSettings"],
    });

  const form = useForm<ChatbotSettingsSchemaType>({
    resolver: zodResolver(ChatbotSettingsSchema),
    defaultValues: chatbotSettings || {},
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onClose();
  };

  // const invalidate = () => {
  //   //TODO - need to find a way to optimistically set the new message
  //   // queryClient.setQueryData(["agentMessages", `chat-${chatId}`], (messages:FullChatMessage[]) => [...messages, newMessage])
  //   queryClient.invalidateQueries({
  //     queryKey: ["agentMessages", `chat-${chatId}`],
  //   });
  // };

  const onChatbotSettingsSubmit = async (values: ChatbotSettingsSchemaType) => {
    setLoading(true);
    const response = await chatbotSettingsUpsert(values);
    if (response.success) {
      toast.success("Chatbot Settings Have been Saved");
      onClose();
    } else {
      onCancel();
      toast.error(response.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!chatbotSettings) return;
    form.setValue("prompt", chatbotSettings.prompt);
    form.setValue("leadInfo", chatbotSettings.leadInfo);
  }, [chatbotSettings]);
  return {
    loading,
    form,
    onCancel,
    onChatbotSettingsSubmit,
  };
};
