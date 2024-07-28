"use server"
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { BluePrintSchema, BluePrintSchemaType } from "@/schemas/blueprint";
import Sync from "twilio/lib/rest/Sync";

//DATA
export const bluePrintsGetAllByUserId = async()=>{
  const user = await currentUser();
  if (!user) return []

  const bluePrints= await db.bluePrint.findMany({where:{userId:user.id},orderBy:{createdAt:"desc"}})

  return bluePrints;
}

// DATA OF ACTIVE BLUEPRINT

export const bluePrintActive= async()=>{
  const user = await currentUser();
  if (!user) return null
  const blueprint = await db.bluePrint.findFirst({where:{userId:user.id,active:true}})

  return blueprint;

}

//ACTIONS

export const bluePrintInsert = async (values: BluePrintSchemaType) => {
  const user = await currentUser();
  if (!user) return { error: "Unathenticated" };

  const validatedFields = BluePrintSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields" };


const{plannedTarget,type,period}=validatedFields.data

await db.bluePrint.updateMany({where:{active:true},data:{active:false}})

const newBluePrint = await db.bluePrint.create({
        data: {
            plannedTarget,type,period,
          userId: user.id,
          endDate: new Date(),
          actualTarget: 0,
        },
      });

      return{success:newBluePrint}
};

