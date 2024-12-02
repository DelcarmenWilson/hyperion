import { getUpcomingAppointments } from "@/actions/appointment";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user } = body;
    const appointments = await getUpcomingAppointments(user);
    return NextResponse.json(appointments);
  } catch (error) {
    console.log("[APPOINTMENTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
