import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import { currentUser } from "@/lib/auth";
import { getFileExtension } from "@/formulas/text";
import { FileRecord } from "@/types/item";
import { v4 as uuidv4 } from "uuid";

export const POST = async (req: any, res: any) => {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Auauthenticated" }, { status: 400 });
  }
    const formData = await req.formData();

  let record: FileRecord = {
    file: formData.get("image"),
    path: formData.get("filePath"),
    id: user.id,
    type: formData.get("type"),
  };

  if (!record.file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }
  const token = uuidv4();
 
    const file = record.file;
    if (!file) return;
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = getFileExtension(file.name);

    const filename = `${token}.${ext}`;
    const image = `/${record.path}/${filename}`;
    
    await writeFile(path.join(process.cwd(), `public${image}`), buffer);
 
    return NextResponse.json({ success: image, status: 201 });
 
};
