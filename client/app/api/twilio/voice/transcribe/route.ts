import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { formatObject } from "@/formulas/objects";

export async function POST(req: Request) {
  const body = await req.formData();

  const j: any = formatObject(body);

  await db.call.update({
    where: { id: j.callSid },
    data: {
      type: "voicemail",
      transcriptionId: j.transcriptionSid,
      transcriptionUrl: j.transcriptionUrl,
      transcriptionText: j.transcriptionText,
    },
  });
  return new NextResponse("", { status: 200 });
}
