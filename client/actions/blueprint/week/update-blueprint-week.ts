"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import {
  UpdateBluePrintWeekSchema,UpdateBluePrintWeekSchemaType
} from "@/schemas/blueprint";



export const updateBluePrintWeek = async (
  values: UpdateBluePrintWeekSchemaType
) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  const {success,data} = UpdateBluePrintWeekSchema.safeParse(values);
  if (!success) throw new Error("Invalid Fields!"); 

  const bluePrintWeek = await db.bluePrintWeek.findUnique({
    where: { id:data.id },
  });

  if (!bluePrintWeek) throw new Error("No weekly blueprint found!"); 


  await db.$transaction([

    db.bluePrintWeek.update({
      where: { id:bluePrintWeek.id },
      data: { ...data },
    }),

    db.bluePrint.update({
      where:{id:bluePrintWeek.bluePrintId},
      data:{
        calls:{increment:data.calls},
        appointments:{increment:data.appointments},
        premium:{increment:data.premium}
      }
    })

  ]) 

  revalidatePath("/blueprint")
  revalidatePath("/")
};

