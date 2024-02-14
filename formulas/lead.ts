import { ImportLeadsFormValues } from "@/types";
import { capitalize } from "./text";
import { reFormatPhoneNumber } from "./phones";
import { Gender, MaritalStatus } from "@prisma/client";
import { importVendors } from "@/constants/vendors";

export const convertLead = (
  result: any,
  vendor: string
): ImportLeadsFormValues[] => {
  switch (vendor) {
    case importVendors[1].value:
      return MediaAlphaLeads(result, vendor);
    case importVendors[2].value:
      return ProspectForLeads(result, vendor);
    default:
      return IlcLeads(result, vendor);
  }
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

const IlcLeads = (result: any, vendor: string): ImportLeadsFormValues[] => {
  let mapped: ImportLeadsFormValues[] = [];
  result.data.map((d: any) => {
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
      gender: Gender.Male,
      maritalStatus: MaritalStatus.Single,
      zipCode: d["Zip"],
      vendor: vendor,
      recievedAt:d["Received Date"]
    };
    mapped.push(newobj);
  });
  return mapped;
};
