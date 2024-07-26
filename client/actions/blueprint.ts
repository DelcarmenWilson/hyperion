"use server"
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { BluePrintSchema, BluePrintSchemaType } from "@/schemas/blueprint";

//DATA
export const bluePrintsGetAllByUserId = async()=>{
  const user = await currentUser();
  if (!user) return []

  const bluePrints= await db.bluePrint.findMany({where:{userId:user.id}})

  return bluePrints;
}


//ACTIONS

export const bluePrintInsert = async (values: BluePrintSchemaType) => {
  const user = await currentUser();
  if (!user) return { error: "Unathenticated" };

  const validatedFields = BluePrintSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields" };

//   await db.bluePrint.create({
//     data: {
//       plannedTarget: validatedFields.data.plannedTarget,
//       type: validatedFields.data.type,
//       period: validatedFields.data.period,
//       userId: user.id,
//       endDate: new Date(),
//       actualTarget: 0,
//     },
//   });

const{plannedTarget,type,period}=validatedFields.data
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

