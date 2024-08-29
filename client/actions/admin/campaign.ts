"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import {
  CampaignAdSchema,
  CampaignAdSchemaType,
  CampaignAdSetSchema,
  CampaignAdSetSchemaType,
  CampaignFormSchema,
  CampaignFormSchemaType,
  CampaignSchema,
  CampaignSchemaType,
  CampaignTargetAudienceSchema,
  CampaignTargetAudienceSchemaType,
} from "@/schemas/campaign";

//DATA
export const campaignsGetAllByUserId = async () => {
  try {
    const user = await currentUser();
    if (!user) return [];
    const campaigns = await db.campaign.findMany({
      where: { userId: user.id },
    });
    return campaigns;
  } catch (error) {
    return [];
  }
};

export const campaignGetById = async (id: string) => {
  try {
    const user = await currentUser();
    if (!user) return null;
    const campaigns = await db.campaign.findUnique({
      where: { id, userId: user.id },
    });
    return campaigns;
  } catch (error) {
    return null;
  }
};

export const campaignAdSetsGetAllByCampaignId = async (campaignId: string) => {
  try {
    const adSets = await db.campaignAdSet.findMany({
      where: { campaignId },
    });
    return adSets;
  } catch (error) {
    return [];
  }
};

export const campaignAdSetGetById = async (id: string) => {
  try {
    const adSet = await db.campaignAdSet.findUnique({
      where: { id },
    });
    return adSet;
  } catch (error) {
    return null;
  }
};

export const campaignAdsGetAllByAdSetId = async (adSetId: string) => {
  try {
    const ads = await db.campaignAd.findMany({
      where: { adSetId },
    });
    return ads;
  } catch (error) {
    return [];
  }
};

export const campaignAdGetById = async (id: string) => {
  try {
    const ad = await db.campaignAd.findUnique({
      where: { id },
    });
    return ad;
  } catch (error) {
    return null;
  }
};

export const campaignFormsGetAllByUserId = async () => {
  try {
    const user = await currentUser();
    if (!user) return [];
    const forms = await db.campaignForm.findMany({
      where: { userId: user.id },
    });
    return forms;
  } catch (error) {
    return [];
  }
};

export const campaignFormById = async (id: string) => {
  try {
    const form = await db.campaignForm.findUnique({
      where: { id },
    });
    return form;
  } catch (error) {
    return null;
  }
};

export const campaignTargetAudiencesGetAllByUserId = async () => {
  try {
    const user = await currentUser();
    if (!user) return [];
    const audiences = await db.campaignTargetAudience.findMany({
      where: { userId: user.id },
    });
    return audiences;
  } catch (error) {
    return [];
  }
};

export const campaignTargetAudienceById = async (id: string) => {
  try {
    const audience = await db.campaignTargetAudience.findUnique({
      where: { id },
    });
    return audience;
  } catch (error) {
    return null;
  }
};

//ACTIONS
export const campaignInsert = async (values: CampaignSchemaType) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const validatedFields = CampaignSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields!!" };

  const newCampaign = await db.campaign.create({
    data: {
      ...validatedFields.data,
      userId: user.id,
    },
  });
  return {
    success: newCampaign,
  };
};

export const campaignUpdateById = async (values: CampaignSchemaType) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const validatedFields = CampaignSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields!!" };

  const updatedCampaign = await db.campaign.update({
    where: { id: validatedFields.data.id },

    data: {
      ...validatedFields.data,
    },
  });
  return { success: updatedCampaign };
};

export const campaignAdSetInsert = async (values: CampaignAdSetSchemaType) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const validatedFields = CampaignAdSetSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields!!" };

  const newAdSet = await db.campaignAdSet.create({
    data: { ...validatedFields.data },
  });
  return { success: newAdSet };
};

export const campaignAdSetUpdateById = async (
  values: CampaignAdSetSchemaType
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const validatedFields = CampaignAdSetSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields!!" };

  const updatedAdSet = await db.campaignAdSet.update({
    where: { id: validatedFields.data.id },

    data: {
      ...validatedFields.data,
    },
  });
  return { success: updatedAdSet };
};

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

export const campaignFormInsert = async (values: CampaignFormSchemaType) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const validatedFields = CampaignFormSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields!!" };

  const newForm = await db.campaignForm.create({
    data: {
      ...validatedFields.data,
      userId: user.id,
    },
  });
  return { success: newForm };
};

export const campaignFormUpdateById = async (
  values: CampaignFormSchemaType
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const validatedFields = CampaignFormSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields!!" };

  const updatedForm = await db.campaignForm.update({
    where: { id: validatedFields.data.id },
    data: {
      ...validatedFields.data,
    },
  });
  return { success: updatedForm };
};

export const campaignTargetAudienceInsert = async (
  values: CampaignTargetAudienceSchemaType
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const validatedFields = CampaignTargetAudienceSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields!!" };

  const newAudience = await db.campaignTargetAudience.create({
    data: {
      ...validatedFields.data,
      userId: user.id,
    },
  });
  return { success: newAudience };
};

export const campaignTargetAudienceUpdateById = async (
  values: CampaignTargetAudienceSchemaType
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const validatedFields = CampaignTargetAudienceSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields!!" };

  const updatedAudience = await db.campaignTargetAudience.update({
    where: { id: validatedFields.data.id },
    data: {
      ...validatedFields.data,
    },
  });
  return { success: updatedAudience };
};
