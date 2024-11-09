"use server"
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { CreateFunnelFormSchemaType } from "@/schemas/funnel";

//DATA
export const funnelsGetAll = async () => {
  const user = await currentUser();
  if (!user) return [];
  const funnels = await db.funnel.findMany({
    where: { userId: user.id },
    include: { funnelPages: true },
  });

  return funnels;
};

export const funnelGetById = async (funnelId: string) => {
  const funnel = await db.funnel.findUnique({
    where: { id: funnelId },
    include: {
      funnelPages: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  return funnel;
};

//ACTIONS
export const funnelUpsertById = async (
  funnel: CreateFunnelFormSchemaType & { liveProducts: string },
  funnelId: string
) => {
  const user = await currentUser();
  if (!user?.id) return;
  const response = await db.funnel.upsert({
    where: { id: funnelId },
    update: funnel,
    create: {
      ...funnel,
      id: funnelId,
      userId: user.id,
    },
  });

  return response;
};