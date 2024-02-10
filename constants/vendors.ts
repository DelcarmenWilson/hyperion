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
    value: "Media_Alpha",
    name: "Media Alpha (Nector)",
  },
  {
    value: "Prospect_For_Leads",
    name: "Prospect For Leads",
  },
];

export const importVendors: VendorType[]=allVendors.slice(1)
