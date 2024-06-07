"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { CarrierSchema, CarrierSchemaType } from "@/schemas/admin";

//CARRIER
//DATA
export const adminCarriersGetAll = async () => {
  try {
    const carriers = await db.carrier.findMany({ orderBy: { name: "asc" } });
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
//ACTIONS
export const adminCarrierInsert = async (values: CarrierSchemaType) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unathenticated" };
  }
  if (user.role == "USER") {
    return { error: "Unauthorized" };
  }
  const validatedFields = CarrierSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { image, name, description } = validatedFields.data;

  const existingCarrier = await db.carrier.findFirst({ where: { name } });
  if (existingCarrier) {
    return { error: "Carrier already exists" };
  }

  const carrier = await db.carrier.create({
    data: {
      image: image as string,
      name,
      description,
    },
  });

  return { success: carrier };
};
export const adminCarrierUpdateById = async (values: CarrierSchemaType) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unathenticated" };
  }
  if (user.role == "USER") {
    return { error: "Unauthorized" };
  }
  const validatedFields = CarrierSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { id, name, description, website, portal } = validatedFields.data;

  const existingCarrier = await db.carrier.findUnique({ where: { id } });
  if (!existingCarrier) {
    return { error: "Carrier does not exists" };
  }

  await db.carrier.update({
    where: { id },
    data: {
      name,
      description,
      website,
      portal,
    },
  });

  return { success: "Carrier updated" };
};
export const adminCarrierUpdateByIdImage = async (
  id: string,
  image: string
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unathenticated" };
  }
  if (user.role == "USER") {
    return { error: "Unauthorized" };
  }

  const existingCarrier = await db.carrier.findUnique({ where: { id } });
  if (!existingCarrier) {
    return { error: "Carrier does not exists" };
  }

  await db.carrier.update({
    where: { id },
    data: {
      image,
    },
  });

  return { success: "Carrier Image has been updated!" };
};
