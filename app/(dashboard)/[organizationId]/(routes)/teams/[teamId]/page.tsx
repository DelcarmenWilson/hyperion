import { db } from "@/lib/db";
import { TeamForm } from "./components/team-form";

const TeamPage = async ({ params }: { params: { teamId: string } }) => {
  const team = await db.team.findUnique({ where: { id: params.teamId } });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8">
        <TeamForm initialData={team} />
      </div>
    </div>
  );
};

export default TeamPage;
