import { teamsGetAll } from "@/data/team";
import { TeamsClient } from "./components/client";
import { Heading } from "@/components/custom/heading";

const TeamsPage = async () => {
  const teams = await teamsGetAll();

  return (
    <>
      <TeamsClient teams={teams} />
    </>
  );
};

export default TeamsPage;
