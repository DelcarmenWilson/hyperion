import { appointmentsGetAllByUserIdUpcoming } from "@/data/appointment";
import { currentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const user = await currentUser();
    if (!user?.id || !user.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const appointments = await appointmentsGetAllByUserIdUpcoming(user.id)    

    return NextResponse.json(appointments);
  } catch (error: any) {
    console.log("APPOINTMENTS_GET", error);
    return new NextResponse("InternalError", { status: 500 });
  }
}
