"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import {
  MedicalConditionSchema,
  MedicalConditionSchemaType,
} from "@/schemas/admin";

//MEDICAL CONDITIONS
//DATA
export const adminMedicalConditionsGetAll = async () => {
  try {
    const conditions = await db.medicalCondition.findMany({
      orderBy: { name: "asc" },
    });
    return conditions;
  } catch (error) {
    return [];
  }
};

//ACTIONS
export const adminMedicalConditionInsert = async (
  values: MedicalConditionSchemaType
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unathenticated" };
  }
  if (user.role == "USER") {
    return { error: "Unauthorized" };
  }
  const validatedFields = MedicalConditionSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { name, description } = validatedFields.data;

  const existingCondition = await db.medicalCondition.findFirst({
    where: { name },
  });
  if (existingCondition) {
    return { error: "Condition already exists" };
  }

  const condition = await db.medicalCondition.create({
    data: {
      name,
      description: description as string,
    },
  });

  return { success: condition };
};
export const adminMedicalConditionImport = async (
  values: MedicalConditionSchemaType[]
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const conditions = await db.medicalCondition.createMany({
    data: values,
    skipDuplicates: true,
  });
  return {
    success: `${conditions.count} condtions out of ${values.length} have been imported`,
  };
};
