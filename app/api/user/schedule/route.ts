import { scheduleGetByUserId } from "@/data/schedule";
import { currentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const user = await currentUser();
    if (!user?.id || !user.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const schedule = await scheduleGetByUserId(user.id)

    return NextResponse.json(schedule);
  } catch (error: any) {
    console.log("SCHEDULE_GET", error);
    return new NextResponse("InternalError", { status: 500 });
  }
}
