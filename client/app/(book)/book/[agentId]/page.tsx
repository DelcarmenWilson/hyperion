import {
  AppointmentLeadSchema,
  AppointmentLeadSchemaType,
} from "@/schemas/appointment";

import { BookAgentClient } from "./components/client";
import { appointmentsGetAllByUserIdUpcoming } from "@/data/appointment";
import { leadGetById } from "@/actions/lead";
import { scheduleGetByUserId } from "@/data/schedule";
import { userGetByUserName } from "@/data/user";

const BookAgentPage = async ({
  params,
  searchParams,
}: {
  params: {
    agentId: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const user = await userGetByUserName(params.agentId);
  const appointments = await appointmentsGetAllByUserIdUpcoming(user?.id!);
  const lead = await leadGetById(searchParams?.lid as string);
  const schedule = await scheduleGetByUserId(user?.id!);

  const formattedLead: AppointmentLeadSchemaType = {
    id: lead?.id!,
    firstName: lead?.firstName!,
    lastName: lead?.lastName!,
    state: lead?.state!,
    cellPhone: lead?.cellPhone!,
    gender: lead?.gender!,
    maritalStatus: lead?.maritalStatus!,
    email: lead?.email!,
  };
  return (
    <BookAgentClient
      userImage={user?.image!}
      schedule={schedule!}
      lead={formattedLead || undefined}
      appointments={appointments}
    />
  );
};

export default BookAgentPage;
