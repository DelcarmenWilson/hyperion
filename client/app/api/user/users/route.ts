import { NextResponse } from "next/server";
import { getOtherUsers } from "@/actions/user";
import { getUsersByRole } from "@/actions/user";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { role } = body;

    let users;
    if (role == "all") 
      users = await getOtherUsers();
     else 
      users = await getUsersByRole(role);
    

    return NextResponse.json(users);
  } catch (error) {
    console.log("USERS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
