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
import { campaignAdSetGetById, campaignGetById, campaignInsert, campaignsGetAllByUserId } from "@/actions/admin/campaign";
import { Campaign } from "@prisma/client";
import { CampaignSchemaType } from "@/schemas/campaign";



export const useCampaignData = (campaignId?: string) => {
  const router = useRouter();

  const { data: campaigns, isFetching: isFetchingCampaigns } =
    useQuery<Campaign[] | null>({
      queryFn: () => campaignsGetAllByUserId(),
      queryKey: ["campaigns"],
    });

    const onCampaignInsert = async (values:CampaignSchemaType) => {
      const insertedCampaign = await campaignInsert(values);
      if (insertedCampaign.success) {
        router.push(`/campaign/${insertedCampaign.success}`);
      } else toast.error(insertedCampaign.error);
    };

    const { data: campaign, isFetching: isFetchingCampaign } =
    useQuery<Campaign | null>({
      queryFn: () => campaignGetById(campaignId!),
      queryKey: ["campaign"],
    });

 
  return {
    campaigns,
    onCampaignInsert,
    campaign,isFetchingCampaign
  };
};

export const useCampaignActions = (onClose: () => void) => {
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

  
  return {
    loading,
    form,
    onCancel,
  };
};
