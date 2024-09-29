import { currentUser } from "@/lib/auth";
import { AvailabilityClient } from "./components/client";
import { scheduleGet } from "@/actions/user/schedule";

const AvailabilityPage = async () => {
  const user = await currentUser();
  const schedule = await scheduleGet(user?.id!);
  return <AvailabilityClient username={user?.name!} schedule={schedule!} />;
};

export default AvailabilityPage;
