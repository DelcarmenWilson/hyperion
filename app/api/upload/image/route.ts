import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getFileExtension } from "@/formulas/text";

export const POST = async (req: any, res: any) => {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Auauthenticated" }, { status: 400 });
  }

  const formData = await req.formData();

  const file: File = formData.get("image");
  const filePath:string = formData.get("filePath"); 
  const id:string = formData.get("id");
  const type:string = formData.get("type");
  
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext=getFileExtension(file.name) 

  const filename = `${id}.${ext}`;
  const image=`/${filePath}/${filename}`
  
  try {
    await writeFile(
      path.join(process.cwd(), `public${image}`),
      buffer
    );
    switch(type){
      case "carrier":
        await db.carrier.update({
          where: { id},
          data: { image },
        });
        break;
        case "user":
          await db.user.update({
            where: { id: user.id },
            data: { image },
          });
          break
    }
    
    return NextResponse.json({ Message: "Success", status: 201 });
  } catch (error) {
    console.log("Error occured ", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};
