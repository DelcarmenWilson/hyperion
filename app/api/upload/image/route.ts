import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getFileExtension } from "@/formulas/text";
import { FileRecord } from "@/types/item";

export const POST = async (req: any, res: any) => {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Auauthenticated" }, { status: 400 });
  }
  

  const formData = await req.formData();

  let record: FileRecord = {
    files: formData.getAll("image"),
    path: formData.get("filePath"),
    id: formData.get("id"),
    type: formData.get("type"),
    fileNames: [],
  };

  if (!record.files.length) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  for (const f in record.files) {
    const index = parseInt(f);
    const file = record.files.at(index);
    if (!file) return;
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = getFileExtension(file.name);

    const filename = `${record.id}_${index}.${ext}`;
    const image = `/${record.path}/${filename}`;
    record.fileNames?.push(image);
    await writeFile(path.join(process.cwd(), `public${image}`), buffer);
  }

  try {
    const filenames = record.fileNames?.join(",");

    switch (record.type) {
      case "carrier":
        await db.carrier.update({
          where: { id: record.id },
          data: { image: filenames },
        });
        break;
      case "feedback":
        await db.feedback.update({
          where: { id: record.id },
          data: { images: filenames },
        });
        break;
      case "task":
        await db.task.update({
          where: { id: record.id },
          data: { images: filenames },
        });
        break;
      case "user":
        await db.user.update({
          where: { id: user.id },
          data: { image: filenames },
        });
        break;
    }
    return NextResponse.json({ Message: "Success", status: 201 });
  } catch (error) {
    console.log("Error occured ", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};
