import { PipelineLead } from "@/types";
import { formatPhoneNumber } from "./phones";
import { UserLicense } from "@prisma/client";
import { formatDob } from "./dates";
import {  Keywords } from "@/constants/texts";
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
    script.replaceAll(Keywords.MY_FIRST_NAME, agentFirstName)
    .replace(Keywords.MY_COMPANY_NAME, "Family First Life")
    .replace(Keywords.MY_OFFICE_PHONE_NUMBER, formatPhoneNumber(defaultNumber))
    .replace(Keywords.MY_LICENSE, license)
    // LEAD INFO
    .replaceAll(Keywords.FIRST_NAME, firstName)
    .replaceAll(Keywords.BIRTHDAY,formatDob(dateOfBirth,NS))
    .replaceAll(Keywords.STREET_ADRESS, address||NS)
    .replaceAll(Keywords.STATE, state)
    .replaceAll(Keywords.SMOKER, smoker?"smoker":"non-smoker")    

    return script;
  };