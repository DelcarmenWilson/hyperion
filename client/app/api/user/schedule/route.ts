import { scheduleGet } from "@/actions/user/schedule";
import { NextResponse } from "next/server";


//TODO - see if this is being used and if not delete the entire file
export async function POST(req: Request) {
  try {
    const body=await req.json()
    const { user } = body;

    const schedule = await scheduleGet()

    return NextResponse.json(schedule);
  } catch (error: any) {
    console.log("SCHEDULE_GET", error);
    return new NextResponse("InternalError", { status: 500 });
  }
}
