import { formatObject } from "@/formulas/objects";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

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
