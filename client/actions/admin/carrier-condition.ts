"use server";
import { db } from "@/lib/db";
import {  currentUser } from "@/lib/auth";
import {
  CarrierConditionSchema,
  CarrierConditionSchemaType,
} from "@/schemas/admin";

// CARRIER CONDITIONS
//DATA
export const adminCarrierConditionsGetAll = async () => {
  try {
    const conditions = await db.carrierCondition.findMany({
      include: { carrier: true, condition: true },
      orderBy: { carrier: { name: "asc" } },
    });
    return conditions;
  } catch (error) {
    return [];
  }
};

export const adminCarrierConditionsGetAllByCarrierId = async (id: string) => {
  try {
    const conditions = await db.carrierCondition.findMany({
      where:{carrierId:id},
      include: { carrier: true, condition: true },
      orderBy: { carrier: { name: "asc" } },
    });
    return conditions;
  } catch (error) {
    return [];
  }
};

export const adminCarrierConditionsGetAllByConditionId = async (id: string) => {
  try {
    const conditions = await db.carrierCondition.findMany({
      where:{conditionId:id},
      include: { carrier: true, condition: true },
      orderBy: { carrier: { name: "asc" } },
    });
    return conditions;
  } catch (error) {
    return [];
  }
};

//ACTIONS
export const adminCarrierConditionsImport = async (
    values: CarrierConditionSchemaType[]
  ) => {
    const user = await currentUser();
    if (!user) {
      return { error: "Unauthorized" };
    }
  
    const newConditions: CarrierConditionSchemaType[] = values.map((condition) => ({   
      carrierId: condition.carrierId,
      conditionId: condition.conditionId,
      requirements: condition.requirements,
      notes: condition.notes
    }));
  
    const conditions = await db.carrierCondition.createMany({
      data: newConditions,
      skipDuplicates: true,
    });
    const duplicates =  newConditions.length-conditions.count; 
  
    return {
      success: `${newConditions.length-duplicates} Carrier Conditions have been imported - duplicates(${duplicates})`,
    };
  };
  
  export const adminCarrierConditionDeleteById = async (id: string) => {
    const user = await currentUser();
  
    if (!user) {
      return { error: "Unathenticated" };
    }
    if (user.role == "USER") {
      return { error: "Unauthorized" };
    }
  
    const existingCondition = await db.carrierCondition.findUnique({
      where: { id },
    });
    if (!existingCondition) {
      return { error: "Carrier Condition does not exists" };
    }
  
    await db.carrierCondition.delete({
      where: { id },
    });
  
    return { success: " condition deleted!" };
  };
  export const adminCarrierConditionInsert = async (
    values: CarrierConditionSchemaType
  ) => {
    const user = await currentUser();
  
    if (!user) {
      return { error: "Unathenticated" };
    }
    if (user.role == "USER") {
      return { error: "Unauthorized" };
    }
    const validatedFields = CarrierConditionSchema.safeParse(values);
  
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }
  
    const { carrierId, conditionId, requirements, notes } = validatedFields.data;
  
    const existingCondition = await db.carrierCondition.findFirst({
      where: { carrierId, conditionId },
    });
    if (existingCondition) {
      return { error: "Term Carrier already exists" };
    }
  
    const termCarrier = await db.carrierCondition.create({
      data: {
        carrierId,
        conditionId,
        requirements,
        notes,
      },
      include: { carrier: true, condition: true },
    });
  
    return { success: termCarrier };
  };
  export const adminCarrierConditionUpdateById = async (
    values: CarrierConditionSchemaType
  ) => {
    const user = await currentUser();
  
    if (!user) {
      return { error: "Unathenticated" };
    }
    if (user.role == "USER") {
      return { error: "Unauthorized" };
    }
    const validatedFields = CarrierConditionSchema.safeParse(values);
  
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }
  
    const { id, carrierId, conditionId, requirements, notes } =
      validatedFields.data;
  
    const existingCarrier = await db.carrierCondition.findUnique({
      where: { id },
    });
    if (!existingCarrier) {
      return { error: "Term Carrier does not exists" };
    }
  
    const condition = await db.carrierCondition.update({
      where: { id },
      data: {
        carrierId,
        conditionId,
        requirements,
        notes,
      },
      include: { carrier: true, condition: true },
    });
  
    return { success: condition };
  };
  