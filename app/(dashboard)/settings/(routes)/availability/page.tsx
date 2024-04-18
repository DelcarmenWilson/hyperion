import { currentUser } from "@/lib/auth";
import { AvailabilityClient } from "./components/client";
import { scheduleGetByUserId } from "@/data/schedule";

const AvailabilityPage = async () => {
  const user = await currentUser();
  const schedule = await scheduleGetByUserId(user?.id!);
  return <AvailabilityClient username={user?.name!} schedule={schedule!} />;
};

export default AvailabilityPage;
