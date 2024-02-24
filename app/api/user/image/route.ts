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

  const file: File = formData.get("profileImage");
  const filePath:string = formData.get("filePath");
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext=getFileExtension(file.name) 
  const filename = `${user.id}.${ext}`;
  try {
    await writeFile(
      path.join(process.cwd(), `public/${filePath}/${filename}`),
      buffer
    );
    await db.user.update({
      where: { id: user.id },
      data: { image: `/${filePath}/${filename}` },
    });
    return NextResponse.json({ Message: "Success", status: 201 });
  } catch (error) {
    console.log("Error occured ", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};
