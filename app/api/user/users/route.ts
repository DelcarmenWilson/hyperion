import { NextResponse } from "next/server";
import { usersGetAll } from "@/data/user";

export async function POST(req: Request) {
  try {
    // const body = await req.json();
    // const { user } = body;
    // const script = await scriptGetOne();
    const users=await usersGetAll()

    return NextResponse.json(users);
  } catch (error) {
    console.log("USERS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
