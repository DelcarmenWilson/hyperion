import { useContext, useEffect, useState } from "react";
import SocketContext from "@/providers/socket";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { create } from "zustand";
import { ShortGptConversation } from "@/types";
import { OnlineUser } from "@/types/user";

import { usePathname, useRouter } from "next/navigation";
import {
  gptConversationInsert,
  gptConversationsGetByUserId,
  gptGetByUserIdActive,
  gptSettingsUpsert,
} from "@/actions/test";
import { GptSettingsSchema, GptSettingsSchemaType } from "@/schemas/test";

// type useChatStore = {
//   isChatOpen: boolean;
//   onChatOpen: () => void;
//   onChatClose: () => void;

//   user?: OnlineUser;
//   chatId?: string;
//   setChatId: (c?: string) => void;
//   isChatInfoOpen: boolean;
//   onChatInfoOpen: (u?: OnlineUser, c?: string) => void;
//   onChatInfoClose: () => void;
// };

// export const useChat = create<useChatStore>((set) => ({
//   isChatOpen: false,
//   onChatOpen: () => set({ isChatOpen: true }),
//   onChatClose: () => set({ isChatOpen: false, isChatInfoOpen: false }),

//   setChatId: (c) => set({ chatId: c }),
//   isChatInfoOpen: false,
//   onChatInfoOpen: (u?, c?) => set({ user: u, chatId: c, isChatInfoOpen: true }),
//   onChatInfoClose: () => set({ isChatInfoOpen: false }),
// }));

export const useGptChatData = (chatId?: string) => {
  const router = useRouter();
  const [conversations, setConversations] = useState<
    ShortGptConversation[] | null | undefined
  >();

  const { data: initConversations, isFetching: isFetchingConversations } =
    useQuery<ShortGptConversation[] | null>({
      queryFn: () => gptConversationsGetByUserId(),
      queryKey: ["gptConversations"],
    });

  const onGptConversationInsert = async () => {
    const insertedConversation = await gptConversationInsert();
    if (insertedConversation.success) {
      router.push(`/chatbot/${insertedConversation.success}`);
    } else toast.error(insertedConversation.error);
  };

  useEffect(() => {
    setConversations(initConversations);
  }, [initConversations]);

  return {
    conversations,
    onGptConversationInsert,
  };
};

export const useGptChatActions = (onClose: () => void) => {
  const [loading, setLoading] = useState(false);
  const { data: gptSettings, isFetching: isFetchingGptSettings } =
    useQuery<GptSettingsSchemaType | null>({
      queryFn: () => gptGetByUserIdActive(),
      queryKey: ["gptSettings"],
    });

  const form = useForm<GptSettingsSchemaType>({
    resolver: zodResolver(GptSettingsSchema),
    defaultValues: gptSettings || {},
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

  const onGpSettingsFormSubmit = async (values: GptSettingsSchemaType) => {
    setLoading(true);
    const response = await gptSettingsUpsert(values);
    if (response.success) {
      toast.success("GptSettings Have been Saved");
      onClose();
    } else {
      onCancel();
      toast.error(response.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!gptSettings) return;
    form.setValue("prompt", gptSettings.prompt);
    form.setValue("leadInfo", gptSettings.leadInfo);
  }, [gptSettings]);
  return {
    loading,
    form,
    onCancel,
    onGpSettingsFormSubmit,
  };
};
