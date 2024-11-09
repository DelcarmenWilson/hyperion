//TYPE
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
