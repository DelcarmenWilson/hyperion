import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const POST = async (req: any, res: any) => {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Auauthenticated" }, { status: 400 });
  }

  const formData = await req.formData();

  const file: File = formData.get("profileImage");
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
 
  const filename = `${user.name}.jpg`;
  try {
    await writeFile(
      path.join(process.cwd(), "public/assets/" + filename),
      buffer
    );
    await db.user.update({
      where: { id: user.id },
      data: { image: `/assets/${filename}` },
    });
    return NextResponse.json({ Message: "Success", status: 201 });
  } catch (error) {
    console.log("Error occured ", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};
