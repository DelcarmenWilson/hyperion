import { teamsGetById } from "@/data/team";
import { currentRole } from "@/lib/auth";
import { FullUserTeamReport } from "@/types";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { teamId } = body;
    const team = await teamsGetById(teamId);

    if (!team) {
      return new NextResponse("Internal error", { status: 500 });
    }

    const userReport: FullUserTeamReport[] = team.users.map((user) => ({
      id: user.id,
      image: user.image,
      userName: user.userName,
      role: user.role,
      calls: user.calls.length,
      appointments: user.appointments.length,
      conversations: user.conversations.length,
      revenue: user.leads.reduce((sum, lead) => sum + lead.saleAmount!, 0),
    }));

    return NextResponse.json(userReport);
  } catch (error) {
    console.log("[USER_TEAM_REPORT_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
