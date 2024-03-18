import { userGetAll } from "@/data/user";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // const body = await req.json();
    // const { user } = body;
    // const script = await scriptGetOne();
    const users=await userGetAll()

    return NextResponse.json(users);
  } catch (error) {
    console.log("USERS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
