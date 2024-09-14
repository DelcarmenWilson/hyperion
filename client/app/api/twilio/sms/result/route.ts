import { formatObject } from "@/formulas/objects";
import { db } from "@/lib/db";
import { client } from "@/lib/twilio/config";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.formData();

  const j: any = formatObject(body);

  const message = await db.leadMessage.findFirst({ where: { sid: j.smsSid } });

  if (message && j.smsStatus != "sent") {
    const results = (await client.messages.get(j.smsSid).fetch()).toJSON();

    await db.leadMessage.update({
      where: { id: message.id },
      data: {
        status: j.smsStatus,
        price: results.price,
        error: j.errorCode,
      },
    });
  }

  return new NextResponse("", { status: 200 });
}
