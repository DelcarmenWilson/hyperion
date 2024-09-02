"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import {
  CampaignAdsetSchema,
  CampaignAdsetSchemaType,
} from "@/schemas/campaign";

//DATA
export const campaignAdsetsGetAllByCampaignId = async (campaign_id: string) => {
  try {
    const adSets = await db.campaignAdset.findMany({
      where: { campaign_id },
    });
    return adSets;
  } catch (error) {
    return [];
  }
};

export const campaignAdsetGetById = async (id: string) => {
  try {
    const adSet = await db.campaignAdset.findUnique({
      where: { id },
    });
    return adSet;
  } catch (error) {
    return null;
  }
};
//ACTIONS
export const campaignAdsetInsert = async (values: CampaignAdsetSchemaType) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const validatedFields = CampaignAdsetSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields!!" };

  const newAdSet = await db.campaignAdset.create({
    data: { ...validatedFields.data },
  });
  return { success: newAdSet };
};

export const campaignAdsetUpdateById = async (
  values: CampaignAdsetSchemaType
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const validatedFields = CampaignAdsetSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields!!" };

  const updatedAdSet = await db.campaignAdset.update({
    where: { id: validatedFields.data.id },

    data: {
      ...validatedFields.data,
    },
  });
  return { success: updatedAdSet };
};

export const campaignAdsetImport = async (
  values: CampaignAdsetSchemaType[]
) => {
  const newAdsets = await db.campaignAdset.createMany({
    data: values,
  });
  if (newAdsets.count == 0)
    return {
      error: "Error trying to import adsets!",
    };

  return {
    success: "Adsets imported Succesfully!",
  };
};
