import { formatDateTime } from "@/formulas/dates";
import { db } from "@/lib/db";
import { client } from "@/lib/twilio/config";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body=await req.json()
  const auth=body.auth;
  if(!auth && auth!="hyperion"){
    return new NextResponse("unauthorized", { status: 404 });
  }
  const appointments = await db.appointment.findMany({
    where:{status:"Scheduled"},
    include: { lead: true },
  });

  if (appointments) {
    appointments.forEach((app) => {
      client.messages.create({
        body: `Appointment reminder - ${formatDateTime(app.startDate)}`,
        from: app.lead.defaultNumber,
        to: app.lead.cellPhone,
      });
    });
  }
   return new NextResponse("", { status: 200 });
}
