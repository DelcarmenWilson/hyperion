"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import {
  CampaignFormSchema,
  CampaignFormSchemaType,
} from "@/schemas/campaign";

//DATA
export const campaignFormsGetAll = async () => {
  try {
    const user = await currentUser();
    if (!user) return [];
    const forms = await db.campaignForm.findMany({
      where: { user_id: user.id },
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

//ACTIONS
export const campaignFormDeleteById = async (id: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const existingForm = await db.campaignForm.findUnique({
    where: { id },
  });

  if (!existingForm) return { error: "Form does not exists!!" };

  if (existingForm.user_id != user.id) return { error: "Unauthorized!!" };

  await db.campaignForm.delete({ where: { id: existingForm.id } });

  return { success: "Form has been deleted!" };
};

export const campaignFormInsert = async (
  values: CampaignFormSchemaType
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const validatedFields = CampaignFormSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields!!" };

  const newForm = await db.campaignForm.create({
    data: {
      ...validatedFields.data,
      user_id: user.id,
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

   await db.campaignForm.update({
    where: { id: validatedFields.data.id },
    data: {
      ...validatedFields.data,
    },
  });
  return { success: "From updated!"};
};

export const campaignFormImport = async (
  values: CampaignFormSchemaType[]
) => {
  const newForms = await db.campaignForm.createMany({
    data: values,
  });
  if (newForms.count == 0)
    return {
      error: "Error trying to import forms!",
    };

  return {
    success: "Forms imported Succesfully!",
  };
};