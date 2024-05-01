import { NextResponse } from "next/server";
import path from "path";
import { writeFile, unlink } from "fs/promises";
import { currentUser } from "@/lib/auth";

import { getFileExtension } from "@/formulas/text";
import { FileRecord } from "@/types/item";

export const POST = async (req: any, res: any) => {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Auauthenticated" }, { status: 400 });
  }

  const formData = await req.formData();

  const record: FileRecord = {
    file: formData.get("image"),
    path: formData.get("filePath"),
    id: formData.get("id"),
    oldFile: formData.get("oldFile"),
  };
  if (!record.file) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }

  try {
    // const token =  uuidv4();

    const file = record.file;
    if (!file) {
      return NextResponse.json(
        { error: "No files received." },
        { status: 400 }
      );
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = getFileExtension(file.name);

    const filename = `${record.id}.${ext}`;
    const image = `${record.path}${filename}`;
    await writeFile(path.join(process.cwd(), `public${image}`), buffer);

    if (record.oldFile) {
      await unlink(path.join(process.cwd(), `public${record.oldFile}`));
    }

    return NextResponse.json({ success: {image,filename}, status: 200 });
  } catch (error) {
    console.log("IMAGE UPLOAD ERROR ", error);
    return NextResponse.json({ error: "Failed", status: 500 });
  }
};
export const PUT = async (req: any, res: any) => {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Auauthenticated" }, { status: 400 });
  }

  const body = await req.json();
  const oldFile = body.oldFile;

  if (!oldFile) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  try {
    await unlink(path.join(process.cwd(), `public${oldFile}`));

    return NextResponse.json({ success: "Success", status: 200 });
  } catch (error) {
    console.log("IMAGE DELETE ERROR ", error);
    return NextResponse.json({ error: "Failed", status: 500 });
  }
};
