import { scheduleGetByUserId } from "@/actions/schedule";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body=await req.json()
    const { user } = body;

    const schedule = await scheduleGetByUserId(user)

    return NextResponse.json(schedule);
  } catch (error: any) {
    console.log("SCHEDULE_GET", error);
    return new NextResponse("InternalError", { status: 500 });
  }
}
