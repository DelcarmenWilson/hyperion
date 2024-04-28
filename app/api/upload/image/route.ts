import { NextResponse } from "next/server";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { writeFile, unlink } from "fs/promises";
import { currentUser } from "@/lib/auth";

import { getFileExtension } from "@/formulas/text";
import { FileRecords } from "@/types/item";

export const POST = async (req: any, res: any) => {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Auauthenticated" }, { status: 400 });
  }

  const formData = await req.formData();

  const record: FileRecords = {
    files: formData.getAll("image"),
    path: formData.get("filePath"),
    id: formData.get("id"),
    type: formData.get("type"),
    fileNames: [],
    oldFile: formData.get("oldFile"),
  };
  console.log(record)
  if (!record.files.length) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  try {
    const token = uuidv4();

    const file = record.files.at(0);
    if (!file) {
      return NextResponse.json(
        { error: "No files received." },
        { status: 400 }
      );
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = getFileExtension(file.name);

    const filename = `${token}.${ext}`;
    const image = `/${record.path}/${filename}`;
    await writeFile(path.join(process.cwd(), `public${image}`), buffer);

    if (record.oldFile) {
      await unlink(path.join(process.cwd(), `public${record.oldFile}`));
    }

    return NextResponse.json({ success: image, status: 200 });
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

// import { NextResponse } from "next/server";
// import path from "path";
// import { v4 as uuidv4 } from "uuid";
// import { writeFile } from "fs/promises";
// import { currentUser } from "@/lib/auth";
// import { FileRecord } from "@/types/item";
// import { getFileExtension } from "@/formulas/text";

// export const POST = async (req: any, res: any) => {
//   const user = await currentUser();
//   if (!user) {
//     return NextResponse.json({ error: "Auauthenticated" }, { status: 400 });
//   }
//     const formData = await req.formData();

//   const record: FileRecord = {
//     file: formData.get("image"),
//     path: formData.get("filePath"),
//     id: user.id,
//     type: formData.get("type"),
//   };

//   if (!record.file) {
//     return NextResponse.json({ error: "No files received." }, { status: 400 });
//   }
//   const token = uuidv4().replaceAll('-','');
//   try {
//     const file = record.file;
//     if (!record.file) return;
//     const buffer = Buffer.from(await file.arrayBuffer());
//     const ext = getFileExtension(file.name);

//     const filename = `/${record.path}/${token}.${ext}`;

//     await writeFile(path.join(process.cwd(), `public${filename}`), buffer);

//     return NextResponse.json({ success: filename, status: 200 });
//   } catch (error) {
//     console.log("IMAGE UPLOAD ERROR ", error);
//     return NextResponse.json({ error: "Failed", status: 500 });
//   }
// };
