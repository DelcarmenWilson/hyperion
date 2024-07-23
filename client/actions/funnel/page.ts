"use server"
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { FunnelPageUpsertType } from "@/types/funnel";


//FUNNEL PAGE
export const funnelPageGetById = async (id: string) => {
    const response = await db.funnelPage.findUnique({
      where: {
        id,
      },
    })  
    return response
  }

  export const funnelPageUpsertById = async (
    funnelPage: FunnelPageUpsertType,
    funnelId: string
  ) => {
    const user=await currentUser()
    if (!user || !funnelId) return
    const response = await db.funnelPage.upsert({
      where: { id: funnelPage.id || '' },
      update: { ...funnelPage },
      create: {
        ...funnelPage,
        content: funnelPage.content
          ? funnelPage.content
          : JSON.stringify([
              {
                content: [],
                id: '__body',
                name: 'Body',
                styles: { backgroundColor: 'white' },
                type: '__body',
              },
            ]),
        funnelId,
      },
    })
  
    revalidatePath(`/funnels/${funnelId}`, 'page')
    return response
  }
  
  export const funnelPageDeleteById = async (funnelPageId: string) => {
    const response = await db.funnelPage.delete({ where: { id: funnelPageId } })  
    return response
  }