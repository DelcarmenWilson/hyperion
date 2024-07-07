import { db } from "@/lib/db"

export const pageUpdatesGetAll = async()=> {
const updates=await db.pageUpdate.findMany()
return updates

}