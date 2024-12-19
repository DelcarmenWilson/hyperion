import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { formatObject } from "@/formulas/objects";

export async function POST(req: Request) {
  const body = await req.formData();

  const j: any = formatObject(body);

  await db.leadCommunication.update({
    where: { id: j.callSid },
    data: {
      type: "voicemail",
      listened:false,
      recordId: j.recordingSid,
      recordUrl: j.recordingUrl,
      recordDuration: parseInt(j.recordingDuration),
    },
  });
  return new NextResponse("", { status: 200 });
}
