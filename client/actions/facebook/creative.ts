"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import {
  CampaignCreativeSchema,
  CampaignCreativeSchemaType,
} from "@/schemas/campaign";
import { error } from "console";

//DATA
export const campaignCreativesGetAll = async () => {
  try {
    const user = await currentUser();
    if (!user) return [];
    const creatives = await db.campaignCreative.findMany({
      where: { user_id: user.id },
    });
    return creatives;
  } catch (error) {
    return [];
  }
};

export const campaignCreativeGetById = async (id: string) => {
  try {
    const creative = await db.campaignCreative.findUnique({
      where: { id },
    });
    return creative;
  } catch (error) {
    return null;
  }
};

//ACTIONS
export const campaignCreativeDeleteById = async (id: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const existingCreative = await db.campaignCreative.findUnique({
    where: { id },
  });

  if (!existingCreative) return { error: "Creative does not exists!!" };

  if (existingCreative.user_id != user.id) return { error: "Unauthorized!!" };

  await db.campaignCreative.delete({ where: { id: existingCreative.id } });

  return { success: "Creative has been deleted!" };
};

export const campaignCreativeInsert = async (
  values: CampaignCreativeSchemaType
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const validatedFields = CampaignCreativeSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields!!" };

  const newCreative = await db.campaignCreative.create({
    data: {
      ...validatedFields.data,
      user_id: user.id,
    },
  });
  return { success: newCreative };
};

export const campaignCreativeUpdateById = async (
  values: CampaignCreativeSchemaType
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const validatedFields = CampaignCreativeSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields!!" };

 await db.campaignCreative.update({
    where: { id: validatedFields.data.id },
    data: {
      ...validatedFields.data,
    },
  });
  return { success: "Creative updated succesfully" };
};

export const campaignCreativeImport = async (
  values: CampaignCreativeSchemaType[]
) => {
  const newCreatives = await db.campaignCreative.createMany({
    data: values,
  });
  if (newCreatives.count == 0)
    return {
      error: "Error trying to import creatives!",
    };

  return {
    success: "Creatives imported Succesfully!",
  };
};
