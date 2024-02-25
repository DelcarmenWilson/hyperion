import { FullLeadNoConvo } from "@/types";
import { format } from "date-fns";
import { formatPhoneNumber, reFormatPhoneNumber } from "./phones";
import { UserLicense } from "@prisma/client";
export const replaceScript = (
    script: string,
    firstName: string,
    lead: FullLeadNoConvo,
    licenses?:UserLicense[]
  ): string => {
    if (!firstName || !lead) return script;
    const license=licenses?.find(e=>e.state==lead.state)?.licenseNumber||"NOT SET"
    // USER INFO
    script = script.replaceAll("#my_first_name", firstName)
    .replace("#my_company_name", "Family First Life")
    .replace("#my_office_phone_number", formatPhoneNumber(lead.defaultNumber)).replace("#my_license", license)
    // LEAD INFO
    .replaceAll("#first_name", lead.firstName)
    .replaceAll("#birthday", lead.dateOfBirth?format(lead.dateOfBirth,"MM-dd-yy"):"NOT SET")
    .replaceAll("#street_adress", lead.address||"NOT SET")
    .replaceAll("#state", lead.state)
    .replaceAll("#smoker", lead.smoker?"smoker":"non-smoker")    
    return script;
  };