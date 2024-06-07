"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

import { LeadExpenseSchema, LeadExpenseSchemaType } from "@/schemas/lead";

import { defaultLeadExpenses } from "@/constants/lead";
//LEAD EXPENSES

// DATA
export const leadExpensesGetAllById = async (leadId: string) => {
    const user = await currentUser();
    if (!user) {
      redirect("/login");
    }
    try {
      const expenses = await db.leadExpense.findMany({
        where: { leadId },
        orderBy: {
          value: "desc",
        },
      });
      return expenses;
    } catch {
      return [];
    }
  };
  
//ACTIONS
export const leadExpenseInsertSheet = async (leadId: string) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unathenticated" };
  }

  const existingLead = await db.lead.findUnique({ where: { id: leadId } });
  if (!existingLead) {
    return { error: "Lead does not exists" };
  }
  const existingLeadExpenses = await db.leadExpense.findFirst({
    where: { leadId },
  });

  if (existingLeadExpenses) {
    return { error: "Lead Sheet already exists" };
  }

  let defaultExpenses = defaultLeadExpenses;
  defaultExpenses.forEach((e) => (e.leadId = leadId));

  await db.leadExpense.createMany({
    data: defaultExpenses,
  });

  const newLeadExpenses = await db.leadExpense.findMany({
    where: { leadId },
  });

  return { success: newLeadExpenses };
};

export const leadExpenseInsert = async (values: LeadExpenseSchemaType) => {
  const validatedFields = LeadExpenseSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { leadId, type, name, value, notes } = validatedFields.data;

  const user = await currentUser();

  if (!user) {
    return { error: "Unathenticated" };
  }

  const existingLead = await db.lead.findUnique({ where: { id: leadId } });
  if (!existingLead) {
    return { error: "Lead does not exists" };
  }

  const newLeadExpense = await db.leadExpense.create({
    data: { leadId, type, name, value, notes },
  });

  return { success: newLeadExpense };
};

export const leadExpenseUpdateById = async (values: LeadExpenseSchemaType) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unathenticated" };
  }

  const validatedFields = LeadExpenseSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { id, name, value, notes } = validatedFields.data;

  const existingExpense = await db.leadExpense.findUnique({ where: { id } });
  if (!existingExpense) {
    return { error: "Expense no longer exists" };
  }

  const updatedExpense = await db.leadExpense.update({
    where: { id },
    data: {
      name,
      value,
      notes,
    },
  });

  return { success: updatedExpense };
};

export const leadExpenseDeleteById = async (id: string) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unathenticated" };
  }

  const existingExpense = await db.leadExpense.findUnique({ where: { id } });
  if (!existingExpense) {
    return { error: "Expense no longer exists" };
  }

  const deletedExpense = await db.leadExpense.delete({
    where: { id },
  });

  return { success: deletedExpense };
};
