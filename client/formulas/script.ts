import { PipelineLead } from "@/types";
import { formatPhoneNumber } from "./phones";
import { UserLicense } from "@prisma/client";
import { formatDob } from "./dates";
export const replaceScript = (
    script: string,
    firstName: string,
    lead: PipelineLead,
    licenses?:UserLicense[]
  ): string => {
    if (!firstName || !lead || !script || !licenses) return script;
    const license=licenses?.find(e=>e.state==lead.state)?.licenseNumber||"NOT SET"
    // USER INFO
    script = script.replaceAll("#my_first_name", firstName)
    .replace("#my_company_name", "Family First Life")
    .replace("#my_office_phone_number", formatPhoneNumber(lead.defaultNumber)).replace("#my_license", license)
    // LEAD INFO
    .replaceAll("#first_name", lead.firstName)
    .replaceAll("#birthday",formatDob(lead.dateOfBirth,"NOT SET"))
    .replaceAll("#street_adress", lead.address||"NOT SET")
    .replaceAll("#state", lead.state)
    .replaceAll("#smoker", lead.smoker?"smoker":"non-smoker")    
    return script;
  };