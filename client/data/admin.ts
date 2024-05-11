import { db } from "@/lib/db";

export const adminUsersGetAll = async () => {
  try {
    const users = await db.user.findMany({
      select: { id: true, userName: true },
    });

    return users;
  } catch {
    return [];
  }
};

// LEAD_STATUS
export const adminLeadStatusGetAll = async () => {
  try {
    const status = await db.leadStatus.findMany({ where: { type: "default" } });
    return status;
  } catch (error) {
    return [];
  }
};

// CARRIERS
export const adminCarriersGetAll = async () => {
  try {
    const carriers = await db.carrier.findMany({orderBy:{name:"asc"}});
    return carriers;
  } catch (error) {
    return [];
  }
};

export const adminCarrierGetById = async (id: string) => {
  try {
    const carrier = await db.carrier.findUnique({ where: { id } });
    return carrier;
  } catch (error) {
    return null;
  }
};
//MEDICAL CONDITIONS
export const adminMedicalConditionsGetAll = async () => {
  try {
    const conditions = await db.medicalCondition.findMany({orderBy:{name:"asc"}});
    return conditions;
  } catch (error) {
    return [];
  }
};
//QUOTES
export const adminQuotesGetAll = async () => {
  try {
    const quotes = await db.quote.findMany({});
    return quotes;
  } catch (error) {
    return [];
  }
};
export const adminQuotesGetActive = async () => {
  try {
    const quote = await db.quote.findFirst({where:{active:true}});
    return quote
  } catch (error) {
    return null;
  }
};
