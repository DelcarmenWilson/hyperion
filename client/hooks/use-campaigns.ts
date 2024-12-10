import { useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useCurrentUser } from "@/hooks/user/use-current";
import { useInvalidate } from "@/hooks/use-invalidate";
import axios from "axios";
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

//TODO - need to rename the function and actions
export const useCampaignData = (adAccount?: string) => {
  const user = useCurrentUser();
  const { invalidate } = useInvalidate();
  const { campaignId, adsetId, adId } = useCampaignId();
  const router = useRouter();

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
      [
        "campaigns",
        "campaignCreatives",
        "campaignAudiences",
        "campaignForms",
      ].forEach((key) => invalidate(key));

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
