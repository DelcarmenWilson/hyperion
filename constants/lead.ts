//TYPE
type LeadType = {
  value: string;
  name: string;
};
export const allLeadTypes: LeadType[] = [
  {
    value: "General",
    name: "General",
  },
  {
    value: "Final_Expense",
    name: "Final Expense",
  },
  {
    value: "Mortgage_Protection",
    name: "Mortgage Protection",
  },
  {
    value: "Iul",
    name: "Iul",
  },
  {
    value: "Annuity",
    name: "Annuity",
  },
];

//VENDORS
type VendorType = {
  value: string;
  name: string;
};
export const allVendors: VendorType[] = [
  {
    value: "Manually_Created",
    name: "Manually Created",
  },
  {
    value: "Integrity_Leads",
    name: "Integrity Leads",
  },
  {
    value: "Leadrilla",
    name: "Leadrilla",
  },
  {
    value: "Media_Alpha",
    name: "Media Alpha (Nector)",
  },
  {
    value: "Mutual_Of_Omaha",
    name: "Mutual Of Omaha",
  },
  {
    value: "Prime_Time_Leads",
    name: "Prime Time Leads",
  },
  {
    value: "Prospect_For_Leads",
    name: "Prospect For Leads",
  },
];

export const importVendors: VendorType[] = allVendors.slice(1);
