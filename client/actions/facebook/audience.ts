"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import {
  CampaignAudienceSchema,
  CampaignAudienceSchemaType,
} from "@/schemas/campaign";

//DATA
export const campaignAudiencesGetAll = async () => {
  try {
    const user = await currentUser();
    if (!user) return [];
    const audiences = await db.campaignAudience.findMany({
      where: { user_id: user.id },
    });
    return audiences;
  } catch (error) {
    return [];
  }
};

export const campaignAudienceById = async (id: string) => {
  try {
    const audience = await db.campaignAudience.findUnique({
      where: { id },
    });
    return audience;
  } catch (error) {
    return null;
  }
};

//ACTIONS
export const campaignAudienceDeleteById = async (id: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unathenticated" };
  }

  const existingAudience = await db.campaignAudience.findUnique({
    where: { id },
  });

  if (!existingAudience) return { error: "Audience does not exists!!" };

  if (existingAudience.user_id != user.id) return { error: "Unauthorized!!" };

  await db.campaignAudience.delete({ where: { id: existingAudience.id } });

  return { success: "Audience has been deleted!" };
};

export const campaignAudienceInsert = async (
  values: CampaignAudienceSchemaType
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const validatedFields = CampaignAudienceSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields!!" };

  const newAudience = await db.campaignAudience.create({
    data: {
      ...validatedFields.data,
      user_id: user.id,
    },
  });
  return { success: newAudience };
};

export const campaignAudienceUpdateById = async (
  values: CampaignAudienceSchemaType
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const validatedFields = CampaignAudienceSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields!!" };

  await db.campaignAudience.update({
    where: { id: validatedFields.data.id },
    data: {
      ...validatedFields.data,
    },
  });
  return { success: "Adience Updated!" };
};


export const campaignAudienceImport = async (
  values: CampaignAudienceSchemaType[]
) => {
  const newCreatives = await db.campaignAudience.createMany({
    data: values,
  });
  if (newCreatives.count == 0)
    return {
      error: "Error trying to import audiences!",
    };

  return {
    success: "Audiences imported Succesfully!",
  };
};