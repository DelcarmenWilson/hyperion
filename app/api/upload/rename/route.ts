import { NextResponse } from "next/server";
import path from "path";
import { rename } from "fs/promises";
import { currentUser } from "@/lib/auth";

import { getFileExtension } from "@/formulas/text";
import { FileRecords } from "@/types/item";


export const PUT = async (req: any, res: any) => {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Anauthenticated" }, { status: 400 });
  }

  const body = await req.json();
  const oldFileName = body.oldFileName;
  const newFileName=body.newFileName
  console.log("oldFileName:",oldFileName,"newFileName:",newFileName)


  if (!oldFileName) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  try {
    await rename(path.join(process.cwd(), `public${oldFileName}`),path.join(process.cwd(), `public${newFileName}`));

    return NextResponse.json({ success: "Success", status: 200 });
  } catch (error) {
    console.log("IMAGE DELETE ERROR ", error);
    return NextResponse.json({ error: "Failed", status: 500 });
  }
};
