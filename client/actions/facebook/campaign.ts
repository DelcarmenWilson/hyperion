"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import {
  CampaignSchema,
  CampaignSchemaType,
} from "@/schemas/campaign";

//DATA
export const campaignGetLast=async()=>{
  try {
    const user = await currentUser();
    if (!user) return null;
    const campaign = await db.campaign.findFirst({
      where: { user_id: user.id },orderBy:{updated_at:"desc"}
    });
    return campaign;
  } catch (error) {
    return null;
  }
};

export const campaignsGetAllByUserId = async () => {
  try {
    const user = await currentUser();
    if (!user) return [];
    const campaigns = await db.campaign.findMany({
      where: { user_id: user.id },include:{adsets:{include:{ads:true}}},orderBy:{updated_at:"desc"}
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
    const campaign = await db.campaign.findUnique({
      where: { id, user_id: user.id }
    });
    return campaign;
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
      user_id: user.id,
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


export const campaignImport = async (values: CampaignSchemaType[]) => {
 
  const newCampaign = await db.campaign.createMany({
    data: values,
  });
  if(newCampaign.count==0)
    return {
      error: "Error trying to import campaigns!",
    };
  
  return {
    success: "Campaigns imported Succesfully!",
  };
};
