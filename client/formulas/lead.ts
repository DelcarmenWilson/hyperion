import { capitalize, stringToJson } from "./text";
import { reFormatPhoneNumber } from "./phones";
import { LeadDefaultStatus } from "@/types/lead";
import { LeadSchemaType } from "@/schemas/lead";
import {  leadRelationShips } from "@/constants/lead";
import { getAge } from "./dates";
import { FullUserCarrier } from "@/types";

const convertHeight = (data: string): string => {
  const split = data.split("");
  const height = parseInt(split[0]) * 12 + parseInt(split[1]);

  return height.toString();
};
const convertType = (data: string): string => {
  switch (data.toLowerCase()) {
    case "mortgage protection - marketplace":
      return "Mortgage_Protection";
    case "final expense":
      return "Final_Expense";
    default:
      return "General";
  }
};
const convertGender = (gender: string): "NA" | "Male" | "Female" => {
  switch (gender.toLocaleLowerCase()) {
    case "male":
      return "Male";
    case "female":
      return "Female";
    default:
      return "NA";
  }
};
const convertMaritalStatus = (
  maritalStatus: string
): "Single" | "Married" | "Widowed" | "Divorced" => {
  switch (maritalStatus.toLocaleLowerCase()) {
    case "married":
      return "Married";
    case "widowed":
      return "Widowed";
    case "divorced":
      return "Divorced";
    default:
      return "Single";
  }
};
export const convertLead = (
  result: any,
  vendor: string,
  type: string,
  status: string,
  assistantId: string | undefined
): LeadSchemaType[] => {
  switch (vendor) {
    case "Avalanche_Leads":
      return Avalanche_Leads(result, vendor, type, status, assistantId);
    case "Amm_Leads":
      return Amm_Leads(result, vendor, type, status, assistantId);
    case "Hyperion":
      return Hyperion(result, vendor, type, status, assistantId);
    case "Leadrilla":
      return Leadrilla(result, vendor, status, assistantId);
    case "Media_Alpha":
      return MediaAlphaLeads(result, vendor, type, status, assistantId);
    case "Mutual_Of_Omaha":
      return MutualOfOmaha(result, vendor, type, status, assistantId);
    case "Prime_Time_Leads":
      return PrimeTime(result, vendor, type, status, assistantId);
    case "Prospect_For_Leads":
      return ProspectForLeads(result, vendor, type, status, assistantId);
    default:
      return IlcLeads(result, vendor, type, status, assistantId);
  }
};

const Avalanche_Leads = (
  result: any,
  vendor: string,
  type: string,
  statusId: string,
  assistantId: string | undefined
): LeadSchemaType[] => {
  let mapped: LeadSchemaType[] = [];
  result.data.map((d: any) => {
    const newobj: LeadSchemaType = {
      id: "",
      firstName: capitalize(d["First_Name"]),
      lastName: capitalize(d["Last_Name"]),
      email: d["Email"].toLowerCase(),
      homePhone: reFormatPhoneNumber(d["Primary_Phone"]),
      cellPhone: reFormatPhoneNumber(d["Primary_Phone"]),
      dateOfBirth: d["DOB"].trim(),
      address: capitalize(d["Address"]),
      city: capitalize(d["City"]),
      state: capitalize(d["State"]),
      zipCode: d["Zip"],
      gender: d["Gender"],
      maritalStatus: "Single",
      height: "",
      recievedAt: d["Date_Posted"],
      vendor,
      type,
      statusId,
      assistantId,
    };
    mapped.push(newobj);
  });
  return mapped;
};

const Amm_Leads = (
  result: any,
  vendor: string,
  type: string,
  statusId: string,
  assistantId: string | undefined
): LeadSchemaType[] => {
  let mapped: LeadSchemaType[] = [];
  result.data.map((d: any) => {
    const newobj: LeadSchemaType = {
      id: "",
      firstName: capitalize(d["first_name"]),
      lastName: capitalize(d["last_name"]),
      email: d["email"].toLowerCase(),
      homePhone: reFormatPhoneNumber(d["phone_number"]),
      cellPhone: reFormatPhoneNumber(d["phone_number"]),
      dateOfBirth: d["date_of_birth"].trim(),
      address: "N/A",
      city: "N/A",
      state: capitalize(d["state"]),
      zipCode: "N/A",
      gender: "NA",
      maritalStatus: "Single",
      height: "",
      recievedAt: d["created_time"],
      vendor,
      type,
      statusId,
      assistantId,
      currentlyInsured:
        d["do_you_currently_have_coverage?"] ==
        "no,_and_i_am_looking_for_coverage"
          ? false
          : true,
      notes: `Beneficary:${d["if_you_qualify_who_will_be_your_beneficiary?"]}`,
    };
    mapped.push(newobj);
  });
  return mapped;
};

const Hyperion = (
  result: any,
  vendor: string,
  type: string,
  statusId: string,
  assistantId: string | undefined
): LeadSchemaType[] => {
  let mapped: LeadSchemaType[] = [];
  result.data.map((d: any) => {
    const newobj: LeadSchemaType = {
      id: "",
      firstName: capitalize(d["first_name"]),
      lastName: capitalize(d["last_name"]),
      email: d["email"].toLowerCase(),
      homePhone: reFormatPhoneNumber(d["phone_number"].replace("p:+", "")),
      cellPhone: reFormatPhoneNumber(d["phone_number"].replace("p:+", "")),
      dateOfBirth: d["date_of_birth"].trim(),
      height: d["could_you_please_provide_your_current_height_and_weight?"],
      weight: d["could_you_please_provide_your_current_weight?"],
      address: d["street_address"],
      city: d["city"],
      state: d["state"].replace(".", ""),
      zipCode: "NA",
      gender: convertGender(d["gender"]),
      maritalStatus: convertMaritalStatus(d["marital_status"]),
      recievedAt: d["created_time"],
      policyAmount: d["how_much_insurance_coverage_will_you_like_to_get?"],
      smoker: d["are_you_a_smoker?"].toLowerCase() == "no" ? false : true,
      vendor: vendor,
      type,
      statusId,
      assistantId,
    };
    mapped.push(newobj);
  });
  return mapped;
};

const IlcLeads = (
  result: any,
  vendor: string,
  type: string,
  statusId: string,
  assistantId: string | undefined
): LeadSchemaType[] => {
  let mapped: LeadSchemaType[] = [];

  result.data.map((d: any) => {
    const a = stringToJson(d["Notes"]);
    const newobj: LeadSchemaType = {
      id: "",
      firstName: capitalize(d["First Name"]),
      lastName: capitalize(d["Last Name"]),
      email: d["Email"].toLowerCase(),
      homePhone: reFormatPhoneNumber(d["Home"]),
      cellPhone: reFormatPhoneNumber(d["Other Phone 1"]),
      dateOfBirth: d["Date Of Birth"].trim(),
      address: capitalize(d["Street Address"]),
      city: capitalize(d["City"]),
      state: capitalize(d["State"]),
      gender: "NA",
      maritalStatus: "Single",
      weight: a?.Weight || "",
      height: a?.Height || "",
      smoker: a?.IsSmoker == "No" ? false : true,
      zipCode: d["Zip"],
      recievedAt: d["Received Date"],
      policyAmount: a?.DesiredCoverageAmount,
      vendor,
      type,
      statusId,
      assistantId,
    };
    mapped.push(newobj);
  });
  return mapped;
};

const Leadrilla = (
  result: any,
  vendor: string,
  statusId: string,
  assistantId: string | undefined
): LeadSchemaType[] => {
  let mapped: LeadSchemaType[] = [];
  result.data.map((d: any) => {
    const fullName = d["name"].split(" ");
    const newobj: LeadSchemaType = {
      id: "",
      firstName: capitalize(fullName[0]),
      lastName: capitalize(fullName[1]),
      email: d["email"].toLowerCase(),
      homePhone: reFormatPhoneNumber(d["phone"]),
      cellPhone: reFormatPhoneNumber(d["phone"]),
      dateOfBirth: d["birthdate"].trim(),
      address: d["street address"],
      city: d["city"],
      state: d["state"],
      zipCode: d["zip"],
      gender: "NA",
      maritalStatus: "Single",
      type: convertType(d["product"]),
      recievedAt: d["date purchased"],
      vendor: vendor,
      statusId,
      assistantId,
    };
    mapped.push(newobj);
  });
  return mapped;
};

const MediaAlphaLeads = (
  result: any,
  vendor: string,
  type: string,
  statusId: string,
  assistantId: string | undefined
): LeadSchemaType[] => {
  let mapped: LeadSchemaType[] = [];
  result.data.map((d: any) => {
    const newobj: LeadSchemaType = {
      id: "",
      firstName: capitalize(d["first_name"]),
      lastName: capitalize(d["last_name"]),
      email: d["email"].toLowerCase(),
      homePhone: reFormatPhoneNumber(d["phone_number"]),
      cellPhone: reFormatPhoneNumber(d["phone_number"]),
      dateOfBirth: d["dob"].trim(),
      address: capitalize(d["street_address"]),
      city: capitalize(d["city"]),
      state: capitalize(d["state"]),
      zipCode: d["postal_code"],
      gender: d["gender"],
      maritalStatus: capitalize(d["marriage"]) as any,
      weight: d["weight"],
      height: `${d["height_feet"]}'${d["height_inches"] || "0"}`,
      income: d["income"],
      smoker: d["tobacco_use"] == "No" ? false : true,
      vendor: vendor,
      recievedAt: d["received_at"],
      type,
      statusId,
      assistantId,
    };
    mapped.push(newobj);
  });
  return mapped;
};
const MutualOfOmaha = (
  result: any,
  vendor: string,
  type: string,
  statusId: string,
  assistantId: string | undefined
): LeadSchemaType[] => {
  let mapped: LeadSchemaType[] = [];
  result.data.map((d: any) => {
    const newobj: LeadSchemaType = {
      id: "",
      firstName: capitalize(d["firstname"]),
      lastName: capitalize(d["lastname"]),

      email: "no.email@email.com",
      homePhone: reFormatPhoneNumber(d["Tele"]),
      cellPhone: reFormatPhoneNumber(d["Tele"]),
      dateOfBirth: undefined,
      address: capitalize(d["address"]),
      city: capitalize(d["city"]),
      state: capitalize(d["State"]),
      zipCode: d["zip"],

      gender: d["PrefixTTL"] == "Ms" ? "Female" : "Male",

      maritalStatus: "Single",
      vendor: vendor,
      type,
      statusId,
      assistantId,
    };
    mapped.push(newobj);
  });
  return mapped;
};
const PrimeTime = (
  result: any,
  vendor: string,
  type: string,
  statusId: string,
  assistantId: string | undefined
): LeadSchemaType[] => {
  let mapped: LeadSchemaType[] = [];
  result.data.map((d: any) => {
    const fullName = d["Name"].split(" ");
    const newobj: LeadSchemaType = {
      id: "",
      firstName: capitalize(fullName[0]),
      lastName: capitalize(fullName[1]),
      email: d["Email"].toLowerCase(),
      homePhone: reFormatPhoneNumber(d["Phone #"]),
      cellPhone: reFormatPhoneNumber(d["Phone #"]),
      dateOfBirth: d["DOB"].trim(),
      address: d["Address"],
      city: d["City"],
      state: d["State"],
      zipCode: d["Zip"],
      gender: "NA",
      maritalStatus: "Single",
      type: convertType(d["Policy Type"]),
      recievedAt: d["Date Requested"],
      policyAmount: d["Amount Requested"],
      vendor: vendor,
      statusId,
      assistantId,
    };
    mapped.push(newobj);
  });
  return mapped;
};

const ProspectForLeads = (
  result: any,
  vendor: string,
  type: string,
  statusId: string,
  assistantId: string | undefined
): LeadSchemaType[] => {
  let mapped: LeadSchemaType[] = [];
  result.data.map((d: any) => {
    const newobj: LeadSchemaType = {
      id: "",
      firstName: capitalize(d["first name"]),
      lastName: capitalize(d["last name"]),
      email: d["email"].toLowerCase(),
      homePhone: reFormatPhoneNumber(d["home phone"]),
      cellPhone: reFormatPhoneNumber(d["work phone"]),
      dateOfBirth: d["date of birth"].trim(),
      address: d["address"],
      city: d["city"],
      state: d["state"],
      zipCode: d["zip"],
      gender: d["gender"],
      maritalStatus: "Single",
      currentlyInsured: d["currently insured"] == "No" ? false : true,
      currentInsuranse: d["current ins.company"],
      income: d["family income"],
      vendor: vendor,
      policyAmount: d["Policy Amount"],
      type,
      statusId,
      assistantId,
    };
    mapped.push(newobj);
  });
  return mapped;
};

export const Amm_Leads_Import = (result: any): LeadSchemaType[] => {
  let mapped: LeadSchemaType[] = [];
  result.map((d: any) => {
    const newobj: LeadSchemaType = {
      id: d["id"],
      firstName: capitalize(d["first_name"]),
      lastName: capitalize(d["last_name"]),
      email: d["email"].toLowerCase(),
      homePhone: reFormatPhoneNumber(d["phone_number"]),
      cellPhone: reFormatPhoneNumber(d["phone_number"]),
      dateOfBirth: d["date_of_birth"].trim(),
      address: "N/A",
      city: "N/A",
      state: capitalize(d["state"]),
      zipCode: "N/A",
      gender: "NA",
      maritalStatus: "Single",
      height: "",
      recievedAt: d["created_time"],
      vendor: "Amm_Leads",
      type: "General",
      statusId: LeadDefaultStatus.NEW,
      currentlyInsured:
        d["do_you_currently_have_coverage?"] ==
        "no,_and_i_am_looking_for_coverage"
          ? false
          : true,
      notes: `Beneficary:${d["if_you_qualify_who_will_be_your_beneficiary?"]}`,
      adId: d["ad_id"],
    };
    mapped.push(newobj);
  });
  return mapped;
};
//TODO - need to work on this mother - this is the relationship bewteen leads but we need to get the opposite ex: Brother => Sister
export const GetLeadOppositeRelationship = (
  relationship: string,
  gender: string
): string => {
  if (gender == "N/A") return "N/A";
  const index = gender == "Male" ? 0 : 1;
  const currentRel = leadRelationShips.find(
    (e) => e.relationship == relationship
  );
  if (!currentRel) return "N/A";

  return currentRel.opposite[index];
};

export type CarrierPremium={
  name:string
  premium:number
}

export const CalculatePremium = (
  carriers: FullUserCarrier[] | undefined,
  dateOfBirth: Date | null | undefined,
  coverage: string
): CarrierPremium[]|string => {
  // Quote Calculation Logic
  if (!carriers) return "There are no available carriers";

  // Get input values
  const caluclateAge = getAge(dateOfBirth);
  const age = caluclateAge == "NA" ? 0 : parseInt(caluclateAge);
  //  const age=36
  const health = "good";
  const coverageAmount = parseInt(coverage);

  // Validate input
  if (
    age.toString() === "" ||
    coverage === "" ||
    isNaN(age) ||
    isNaN(coverageAmount)
  ) {
    return "Please fill all fields correctly.";
  }

  // Calculate base premium based on age
  let basePremium = 100; // Starting premium
  if (age < 25) {
    basePremium += 50;
  } else if (age >= 25 && age <= 40) {
    basePremium += 20;
  } else if (age > 40) {
    basePremium += 100;
  }

  // Adjust premium based on health condition
  let healthMultiplier = 1;
  if (health === "good") {
    healthMultiplier = 1;
  } else if (health === "average") {
    healthMultiplier = 1.5;
  } else if (health === "poor") {
    healthMultiplier = 2;
  }

  // Final premium calculation
  const premium = basePremium * healthMultiplier * (coverageAmount / 1000);

let carrierPremiums:CarrierPremium[]=[]

carriers.forEach(carrier=>{
  carrierPremiums.push({name:carrier.carrier.name,premium:premium})
})


  // return premium.toString();
  return carrierPremiums
};
