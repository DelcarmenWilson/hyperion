"use server"
import { db } from "@/lib/db"
import { currentUser } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { createScriptSchema, createScriptSchemaType } from "@/schemas/script"

import { UPPERADMINS } from "@/constants/user"
import { redirect } from "next/navigation"

export const createScript=async(values: createScriptSchemaType)=>{
const user=await currentUser()
if(!user) throw new Error("unathenticated")
const {success,data}=createScriptSchema.safeParse(values)
if(!success) throw new Error("invalid data")

    const df = UPPERADMINS.includes(user!.role)?true:false;

const results=await db.script.create({data:{
...data,
content:"",
userId:user.id!,default:df
}})

if(!results) throw new Error("failed to create script")
    //Create a renavigation to the next script page

redirect(`/admin/scripts/${results.id}`)












// revalidatePath("/admin/scripts");
}




