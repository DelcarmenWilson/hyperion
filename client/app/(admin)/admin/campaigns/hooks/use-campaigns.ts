import { useContext, useEffect, useMemo, useState } from "react";
import { useCurrentUser } from "@/hooks/user/use-current";
import axios from "axios";
import { create } from "zustand";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import SocketContext from "@/providers/socket";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FullAd, FullCampaign } from "@/types";

import {
  Campaign,
  CampaignAdset,
  CampaignAudience,
  CampaignCreative,
  CampaignForm,
} from "@prisma/client";
import { CampaignSchemaType } from "@/schemas/campaign";

import {
  campaignGetById,
  campaignInsert,
  campaignsGetAllByUserId,
} from "@/actions/facebook/campaign";
import { campaignAdsetGetById } from "@/actions/facebook/adSet";
import { campaignAdGetById } from "@/actions/facebook/ad";
import { campaignCreativesGetAll } from "@/actions/facebook/creative";
import { campaignAudiencesGetAll } from "@/actions/facebook/audience";
import { campaignFormsGetAll } from "@/actions/facebook/form";

type CampaignStore = {
  isFormViewOpen: boolean;
  setFormViewOpen: () => void;

  isAudienceViewOpen: boolean;
  setAudienceViewOpen: () => void;

  isCreativeViewOpen: boolean;
  setCreativeViewOpen: () => void;
};

export const useCampaign = create<CampaignStore>((set, get) => ({
  isFormViewOpen: false,
  setFormViewOpen: () =>
    set({
      isFormViewOpen: get().isFormViewOpen == false ? true : false,
      isAudienceViewOpen: false,
      isCreativeViewOpen: false,
    }),

  isAudienceViewOpen: false,
  setAudienceViewOpen: () =>
    set({
      isAudienceViewOpen: get().isAudienceViewOpen == false ? true : false,
      isCreativeViewOpen: false,
      isFormViewOpen: false,
    }),

  isCreativeViewOpen: false,
  setCreativeViewOpen: () =>
    set({
      isCreativeViewOpen: get().isCreativeViewOpen == false ? true : false,
      isAudienceViewOpen: false,
      isFormViewOpen: false,
    }),
}));

export const useCampaignData = (adAccount?: string) => {
  const user = useCurrentUser();
  const queryClient = useQueryClient();
  const { campaignId, adsetId, adId } = useCampaignId();
  const router = useRouter();

  const invalidate = (queries: string[]) => {
    queries.forEach((query) => {
      queryClient.invalidateQueries({ queryKey: [query] });
    });
  };

  const { data: campaigns, isFetching: isFetchingCampaigns } = useQuery<
    FullCampaign[] | []
  >({
    queryFn: () => campaignsGetAllByUserId(),
    queryKey: ["campaigns"],
  });

  const { data: campaign, isFetching: isFetchingCampaign } =
    useQuery<Campaign | null>({
      queryFn: () => campaignGetById(campaignId),
      queryKey: [`campaign-${campaignId}`],
    });

  const { data: adset, isFetching: isFetchingAdset } =
    useQuery<CampaignAdset | null>({
      queryFn: () => campaignAdsetGetById(adsetId),
      queryKey: [`campaignAdset-${adsetId}`],
    });

  const { data: ad, isFetching: isFetchingAd } = useQuery<FullAd | null>({
    queryFn: () => campaignAdGetById(adId),
    queryKey: [`campaignAd-${adId}`],
  });

  const onCampaignInsert = async (values: CampaignSchemaType) => {
    const insertedCampaign = await campaignInsert(values);
    if (insertedCampaign.success) {
      router.push(`/campaign/${insertedCampaign.success}`);
    } else toast.error(insertedCampaign.error);
  };

  const onImportCampaings = async () => {
    const response = await axios.post(`/api/facebook/import`, {
      userid: user?.id,
      adAccount: adAccount as string,
    });
    const data = response.data;
    if (data.success) {
      invalidate([
        "campaigns",
        "campaignCreatives",
        "campaignAudiences",
        "campaignForms",
      ]);

      router.refresh();
      toast.success("Campaigns Imported Succesfully!");
    } else toast.error("Campaigns could not be imported!");
  };

  return {
    campaignId,
    adsetId,
    adId,
    campaigns,
    isFetchingCampaigns,
    campaign,
    isFetchingCampaign,
    adset,
    ad,
    isFetchingAd,
    isFetchingAdset,
    onCampaignInsert,
    onImportCampaings,
  };
};

export const useCampaignViewData = () => {
  const { data: creatives, isFetching: isFetchingCreatives } = useQuery<
    CampaignCreative[] | []
  >({
    queryFn: () => campaignCreativesGetAll(),
    queryKey: ["campaignCreatives"],
  });

  const { data: audiences, isFetching: isFetchingAudiences } = useQuery<
    CampaignAudience[] | []
  >({
    queryFn: () => campaignAudiencesGetAll(),
    queryKey: ["campaignAudiences"],
  });
  const { data: forms, isFetching: isFetchingForms } = useQuery<
    CampaignForm[] | []
  >({
    queryFn: () => campaignFormsGetAll(),
    queryKey: ["campaignForms"],
  });

  return {
    creatives,
    isFetchingCreatives,
    audiences,
    isFetchingAudiences,
    forms,
    isFetchingForms,
  };
};

export const useCampaignId = () => {
  const params = useParams();
  const campaignId = useMemo(() => {
    if (!params?.campiagnid) {
      return "";
    }

    return params?.campiagnid as string;
  }, [params?.campiagnid]);

  const adsetId = useMemo(() => {
    if (!params?.adsetid) {
      return "";
    }

    return params?.adsetid as string;
  }, [params?.adsetid]);

  const adId = useMemo(() => {
    if (!params?.adid) {
      return "";
    }

    return params?.adid as string;
  }, [params?.adid]);

  return useMemo(
    () => ({
      campaignId,
      adsetId,
      adId,
    }),
    [campaignId, adsetId, adId]
  );
};
