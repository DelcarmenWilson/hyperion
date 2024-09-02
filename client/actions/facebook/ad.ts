"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import {
  CampaignAdSchema,
  CampaignAdSchemaType,
} from "@/schemas/campaign";

//DATA

export const campaignAdsGetAllByAdSetId = async (adset_id: string) => {
  try {
    const ads = await db.campaignAd.findMany({
      where: { adset_id },
    });
    return ads;
  } catch (error) {
    return [];
  }
};

export const campaignAdGetById = async (id: string) => {
  try {
    const ad = await db.campaignAd.findUnique({
      where: { id },include:{creative:true}
    });
    return ad;
  } catch (error) {
    return null;
  }
};


//ACTIONS
export const campaignAdInsert = async (values: CampaignAdSchemaType) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const validatedFields = CampaignAdSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields!!" };

  const newAd = await db.campaignAd.create({
    data: {
      ...validatedFields.data,
    },
  });
  return { success: newAd };
};

export const campaignAdUpdateById = async (values: CampaignAdSchemaType[]) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const validatedFields = CampaignAdSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields!!" };

  const updatedAd = await db.campaignAd.update({
    where: { id: validatedFields.data.id },
    data: {
      ...validatedFields.data,
    },
  });
  return { success: updatedAd };
};

export const campaignAdImport = async (
  values: CampaignAdSchemaType[]
) => {
  const newAds = await db.campaignAd.createMany({
    data: values,
  });
  if (newAds.count == 0)
    return {
      error: "Error trying to import ads!",
    };

  return {
    success: "Ads imported Succesfully!",
  };
};
