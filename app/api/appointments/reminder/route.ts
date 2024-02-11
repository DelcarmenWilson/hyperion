import { client } from "@/lib/twilio-config";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { format } from "date-fns";

export async function GET(req: Request) {
  const appointments = await db.appointment.findMany({
    include: { lead: true },
  });
  console.log(appointments)

  if (appointments) {
    appointments.forEach((app) => {
      client.messages.create({
        body: `appointment reminder - ${format(app.date,"MM-dd @ hh:mm aa")}`,
        from: app.lead.defaultNumber,
        to: app.lead.cellPhone,
      });
    });
  }
  //  return NextResponse.json(appointments);
   return new NextResponse("", { status: 200 });
}
