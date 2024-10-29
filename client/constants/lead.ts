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

export const leadDefaultStatus: {
  new: string;
  deleted: string;
  doNotCall: string;
  sold: string;
} = {
  new: "clssh61710000hgo3esopwumj",
  deleted: "cm2s8rui802jouo6fit19ljlj",
  doNotCall: "clsshj6p80007hgo3avc5s7oe",
  sold: "clsshj95h0008hgo3d6tbby9y",
};

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
  { value: "Amm_Leads", name: "Amm Leads" },
  {
    value: "Avalanche_Leads",
    name: "Avalanche Leads",
  },
  {
    value: "Hyperion",
    name: "Hyperion",
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

type LeadExpenseType = {
  leadId: string;
  name: string;
  type: string;
  isDefault: boolean;
};
export const defaultLeadExpenses: LeadExpenseType[] = [
  {
    leadId: "",
    name: "Rent/Mortgage",
    type: "Expense",
    isDefault: true,
  },
  {
    leadId: "",
    name: "Vehicle Expenses",
    type: "Expense",
    isDefault: true,
  },
  {
    leadId: "",
    name: "Utilities",
    type: "Expense",
    isDefault: true,
  },

  {
    leadId: "",
    name: "Groceries",
    type: "Expense",
    isDefault: true,
  },
  {
    leadId: "",
    name: "Entertainment",
    type: "Expense",
    isDefault: true,
  },
  {
    leadId: "",
    name: "Taxes",
    type: "Expense",
    isDefault: true,
  },
  {
    leadId: "",
    name: "Credit Cards",
    type: "Expense",
    isDefault: true,
  },
  {
    leadId: "",
    name: "Salary",
    type: "Income",
    isDefault: true,
  },
  {
    leadId: "",
    name: "Retirement Plan",
    type: "Income",
    isDefault: true,
  },
];
type LeadRealtionShipType = {
  relationship: string;
  opposite: string[];
};
export const leadRelationShips: LeadRealtionShipType[] = [
  { relationship: "N/A", opposite: ["N/A", "N/A"] },
  { relationship: "Child", opposite: ["Father", "Mother"] },
  { relationship: "Daughter", opposite: ["Father", "Mother"] },
  { relationship: "Son", opposite: ["Father", "Mother"] },
  { relationship: "Spouse", opposite: ["Spouse", "Spouse"] },
  { relationship: "Mother", opposite: ["Son", "Daughter"] },
  { relationship: "Father", opposite: ["Son", "Daughter"] },
  { relationship: "Brother", opposite: ["Brother", "Sister"] },
  { relationship: "Sister", opposite: ["Brother", "Sister"] },
  { relationship: "Aunt", opposite: ["Nephew", "Niece"] },
  { relationship: "Uncle", opposite: ["Nephew", "Niece"] },
  { relationship: "Nephew", opposite: ["Uncle", "Aunt"] },
  { relationship: "Niece", opposite: ["Uncle", "Aunt"] },
  { relationship: "Husband", opposite: ["Husband", "Wife"] },
  { relationship: "Wife", opposite: ["Husband", "Wife"] },
  { relationship: "Other", opposite: ["N/A", "N/A"] },
];
