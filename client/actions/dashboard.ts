"use server";
import { db } from "@/lib/db";
import { getEntireDay, getLast24hrs } from "@/formulas/dates";
import { currentUser } from "@/lib/auth";
import { DashboardDataType } from "@/types/dashboard";
//DATA
export const dashboardGetAllCards = async () => {
  try {
    const user=await currentUser()
    if(!user){
      return null
    }

    const calls = await db.call.groupBy({
      by:["direction"],
      where: { userId:user.id, createdAt: { gte: getEntireDay().start } },
      _count: {
        direction: true,
    },
    });

    const date = getEntireDay();
    const leads = await db.lead.aggregate({
      _count: { id: true },
      where: {
        userId:user.id,
        createdAt: { gte: date.start },
      },
    });

    const messages = await db.message.aggregate({
      _count:{id:true},      
      where: {senderId:user.id,hasSeen:false },
    });

    const feeds = await db.feed.aggregate({
      _count:{id:true}, 
      where: { userId: user?.id, read: false },
    });
   

    const dashboardData={
      leads:leads._count.id,
      texts:messages._count.id,
      inbound:calls.find((e)=>e.direction.toLowerCase()=="inbound")?._count.direction || 0,
      outbound:calls.find((e)=>e.direction.toLowerCase()=="outbound")?._count.direction || 0,
      feeds:feeds._count.id
    }


    return dashboardData
  } catch {
    return null;
  }
};

