import * as z from "zod";
import { capitalize } from "./text";
import { reFormatPhoneNumber } from "./phones";
import { LeadSchema } from "@/schemas";

type ImportLeadsFormValues = z.infer<typeof LeadSchema>;

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
  vendor: string
): ImportLeadsFormValues[] => {
  switch (vendor) {
    case "Avalanche_Leads":
      return Avalanche_Leads(result, vendor);
    case "Hyperion":
      return Hyperion(result, vendor);
    case "Leadrilla":
      return Leadrilla(result, vendor);
    case "Media_Alpha":
      return MediaAlphaLeads(result, vendor);
    case "Mutual_Of_Omaha":
      return MutualOfOmaha(result, vendor);
    case "Prime_Time_Leads":
      return PrimeTime(result, vendor);
    case "Prospect_For_Leads":
      return ProspectForLeads(result, vendor);
    default:
      return IlcLeads(result, vendor);
  }
};

const Avalanche_Leads = (
  result: any,
  vendor: string
): ImportLeadsFormValues[] => {
  let mapped: ImportLeadsFormValues[] = [];
  result.data.map((d: any) => {
    const newobj: ImportLeadsFormValues = {
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
      vendor: vendor,
      recievedAt: d["Date_Posted"],
    };
    mapped.push(newobj);
  });
  return mapped;
};

const Hyperion = (result: any, vendor: string): ImportLeadsFormValues[] => {
  let mapped: ImportLeadsFormValues[] = [];
  result.data.map((d: any) => {
    const newobj: ImportLeadsFormValues = {
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
      type: "General",
      recievedAt: d["created_time"],
      policyAmount: d["how_much_insurance_coverage_will_you_like_to_get?"],
      vendor: vendor,
      smoker: d["are_you_a_smoker?"].toLowerCase() == "no" ? false : true,
    };
    mapped.push(newobj);
  });
  return mapped;
};
const IlcLeads = (result: any, vendor: string): ImportLeadsFormValues[] => {
  let mapped: ImportLeadsFormValues[] = [];
  const extractInfo = (data: string): any => {
    if (!data) return {};
    let exData = data
      .replaceAll('"', "")
      .replaceAll("' ", "")
      .replaceAll(": ", '":"')
      .replaceAll("] [", '","')
      .replace("[", '{"')
      .replace("]", '"}');
    return JSON.parse(exData);
  };

  result.data.map((d: any) => {
    const a = extractInfo(d["Notes"]);
    const newobj: ImportLeadsFormValues = {
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
      weight: a["Weight"],
      height: a["Height"],
      smoker: a["IsSmoker"] == "No" ? false : true,
      zipCode: d["Zip"],
      recievedAt: d["Received Date"],
      policyAmount: a["DesiredCoverageAmount"],
      vendor: vendor,
    };
    mapped.push(newobj);
  });
  return mapped;
};
const Leadrilla = (result: any, vendor: string): ImportLeadsFormValues[] => {
  let mapped: ImportLeadsFormValues[] = [];
  result.data.map((d: any) => {
    const fullName = d["name"].split(" ");
    const newobj: ImportLeadsFormValues = {
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
    };
    mapped.push(newobj);
  });
  return mapped;
};
const MediaAlphaLeads = (
  result: any,
  vendor: string
): ImportLeadsFormValues[] => {
  let mapped: ImportLeadsFormValues[] = [];
  result.data.map((d: any) => {
    const newobj: ImportLeadsFormValues = {
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
    };
    mapped.push(newobj);
  });
  return mapped;
};
const MutualOfOmaha = (
  result: any,
  vendor: string
): ImportLeadsFormValues[] => {
  let mapped: ImportLeadsFormValues[] = [];
  result.data.map((d: any) => {
    const newobj: ImportLeadsFormValues = {
      id: "",
      firstName: capitalize(d["firstname"]),
      lastName: capitalize(d["lastname"]),

      email: "no.email@email.com",
      homePhone: reFormatPhoneNumber(d["Tele"]),
      cellPhone: reFormatPhoneNumber(d["Tele"]),
      dateOfBirth: "",
      address: capitalize(d["address"]),
      city: capitalize(d["city"]),
      state: capitalize(d["State"]),
      zipCode: d["zip"],

      gender: d["PrefixTTL"] == "Ms" ? "Female" : "Male",

      maritalStatus: "Single",
      vendor: vendor,
    };
    mapped.push(newobj);
  });
  return mapped;
};
const PrimeTime = (result: any, vendor: string): ImportLeadsFormValues[] => {
  let mapped: ImportLeadsFormValues[] = [];
  result.data.map((d: any) => {
    const fullName = d["Name"].split(" ");
    const newobj: ImportLeadsFormValues = {
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
    };
    mapped.push(newobj);
  });
  return mapped;
};
const ProspectForLeads = (
  result: any,
  vendor: string
): ImportLeadsFormValues[] => {
  let mapped: ImportLeadsFormValues[] = [];
  result.data.map((d: any) => {
    const newobj: ImportLeadsFormValues = {
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
    };
    mapped.push(newobj);
  });
  return mapped;
};
