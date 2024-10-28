import { PipelineLead } from "@/types";
import { formatPhoneNumber } from "./phones";
import { UserLicense } from "@prisma/client";
import { formatDob } from "./dates";
const NS="Not Set";

export const replaceScript = (
    script: string,
    agentFirstName: string,
    lead: PipelineLead,
    licenses?:UserLicense[]
  ): string => {
    if (!agentFirstName || !lead || !script) return script;
    const license=licenses?.find(e=>e.state==lead.state)?.licenseNumber||NS
    const {defaultNumber,firstName,dateOfBirth,address,state,smoker}=lead
    // USER INFO
    script = script.replaceAll("#my_first_name", agentFirstName)
    .replace("#my_company_name", "Family First Life")
    .replace("#my_office_phone_number", formatPhoneNumber(defaultNumber))
    .replace("#my_license", license)
    // LEAD INFO
    .replaceAll("#first_name", firstName)
    .replaceAll("#birthday",formatDob(dateOfBirth,NS))
    .replaceAll("#street_adress", address||NS)
    .replaceAll("#state", state)
    .replaceAll("#smoker", smoker?"smoker":"non-smoker")    

    return script;
  };