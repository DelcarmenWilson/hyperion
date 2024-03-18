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
  const type: string = formData.get("type");
  const file: File = formData.get("voicemail");
  const filePath: string = formData.get("filePath");
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = getFileExtension(file.name);
  const filename = `/${filePath}/${user.id}.${ext}`;
  try {
     await writeFile(path.join(process.cwd(), `public${filename}`), buffer);     

    if (type == "in") {
      await db.chatSettings.update({
        where: { userId: user.id },
        data: { voicemailIn: filename },
      });
    } else {
      await db.chatSettings.update({
        where: { userId: user.id },
        data: { voicemailOut: filename },
      });
    }

    return NextResponse.json({ Message: "Success", status: 201 });
  } catch (error) {
    console.log("Error occured ", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};
