import { ImportLeadsFormValues } from "@/types";
import { capitalize } from "./text";
import { reFormatPhoneNumber } from "./phones";
import { MaritalStatus } from "@prisma/client";

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
export const convertLead = (
  result: any,
  vendor: string
): ImportLeadsFormValues[] => {
  switch (vendor) {
    case "Media_Alpha":
      return MediaAlphaLeads(result, vendor);
    case "Prospect_For_Leads":
      return ProspectForLeads(result, vendor);
    case "Mutual_Of_Omaha":
      return MutualOfOmaha(result, vendor);
    case "Prime_Time_Leads":
      return PrimeTime(result, vendor);
    case "Leadrilla":
      return Leadrilla(result, vendor);
    default:
      return IlcLeads(result, vendor);
  }
};

const IlcLeads = (result: any, vendor: string): ImportLeadsFormValues[] => {
  let mapped: ImportLeadsFormValues[] = [];
  const extractInfo = (data: string): any => {
    let exData =
      data
        .replaceAll('"]', '",')
        .replace("[", '{"')
        .replaceAll("[", '"')
        .replaceAll("]", '",')
        .replaceAll(": ", '":"')
        .replaceAll(" ", "") + "}";

    exData = exData.replace('","}', '"}').replace(",}", "}");
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
      dateOfBirth: d["Date Of Birth"],
      address: capitalize(d["Street Address"]),
      city: capitalize(d["City"]),
      state: capitalize(d["State"]),
      gender: "NA",
      maritalStatus: MaritalStatus.Single,
      weight: parseInt(a["Weight"]),
      height: a["Height"],
      smoker: a["IsSmoker"] == "No" ? false : true,
      zipCode: d["Zip"],
      recievedAt: d["Received Date"],
      policyAmount: parseInt(a["DesiredCoverageAmount"]),
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
      dateOfBirth: d["dob"],
      address: capitalize(d["street_address"]),
      city: capitalize(d["city"]),
      state: capitalize(d["state"]),
      zipCode: d["postal_code"],
      gender: d["gender"],
      maritalStatus: capitalize(d["marriage"]) as any,
      weight: parseInt(d["weight"]),
      height: `${d["height_feet"]}'${d["height_inches"] || "0"}`,
      income: parseInt(d["income"]),
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
      dateOfBirth: d["date of birth"],
      address: d["address"],
      city: d["city"],
      state: d["state"],
      zipCode: d["zip"],
      gender: d["gender"],
      maritalStatus: MaritalStatus.Single,
      currentlyInsured: d["currently insured"] == "No" ? false : true,
      currentInsuranse: d["current ins.company"],
      income: parseInt(d["family income"]),
      vendor: vendor,
      policyAmount: parseInt(d["Policy Amount"]),
    };
    mapped.push(newobj);
  });
  return mapped;
};
//TODO - this has to be fixed
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
      dateOfBirth: d["DOB"],
      address: d["Address"],
      city: d["City"],
      state: d["State"],
      zipCode: d["Zip"],
      gender: "NA",
      maritalStatus: MaritalStatus.Single,
      type:convertType(d["Policy Type"]),
      recievedAt: d["Date Requested"],
      policyAmount: parseInt(d["Amount Requested"]),
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
      dateOfBirth: d["birthdate"],
      address: d["street address"],
      city: d["city"],
      state: d["state"],
      zipCode: d["zip"],
      gender: "NA",
      maritalStatus: MaritalStatus.Single,
      type:convertType(d["product"]),
      recievedAt: d["date purchased"],
      vendor: vendor,
    };
    mapped.push(newobj);
  });
  return mapped;
};
