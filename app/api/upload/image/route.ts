import { NextResponse } from "next/server";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { writeFile } from "fs/promises";
import { currentUser } from "@/lib/auth";
import { FileRecord } from "@/types/item";
import { getFileExtension } from "@/formulas/text";

export const POST = async (req: any, res: any) => {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Auauthenticated" }, { status: 400 });
  }
    const formData = await req.formData();

  const record: FileRecord = {
    file: formData.get("image"),
    path: formData.get("filePath"),
    id: user.id,
    type: formData.get("type"),
  };

  if (!record.file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }
  const token = uuidv4().replaceAll('-','');
  try {
    const file = record.file;
    if (!record.file) return;
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = getFileExtension(file.name);

    const filename = `/${record.path}/${token}.${ext}`;
    
    await writeFile(path.join(process.cwd(), `public${filename}`), buffer);
 
    return NextResponse.json({ success: filename, status: 200 });
  } catch (error) {
    console.log("IMAGE UPLOAD ERROR ", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};
