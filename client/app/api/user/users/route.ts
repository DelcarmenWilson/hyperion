import { NextResponse } from "next/server";
import { usersGetAll } from "@/data/user";
import { usersGetAllByRole } from "@/actions/user";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { role } = body;

    let users;
    if (role == "all") 
      users = await usersGetAll();
     else 
      users = await usersGetAllByRole(role);
    

    return NextResponse.json(users);
  } catch (error) {
    console.log("USERS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
