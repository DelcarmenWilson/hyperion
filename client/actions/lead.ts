"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

import {
  LeadBeneficiarySchema,
  LeadBeneficiarySchemaType,
  LeadConditionSchema,
  LeadConditionSchemaType,
  LeadExpenseSchema,
  LeadExpenseSchemaType,
  LeadGeneralSchema,
  LeadGeneralSchemaType,
  LeadMainSchema,
  LeadMainSchemaType,
  LeadPolicySchema,
  LeadPolicySchemaType,
  LeadSchema,
  LeadSchemaType,
} from "@/schemas/lead";

import { activityInsert } from "./activity";
import { userGetByAssistant } from "@/data/user";

import { reFormatPhoneNumber } from "@/formulas/phones";
import { states } from "@/constants/states";
import { defaultLeadExpenses } from "@/constants/lead";

export const leadInsert = async (values: LeadSchemaType) => {
  const validatedFields = LeadSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const {
    firstName,
    lastName,
    address,
    city,
    state,
    zipCode,
    homePhone,
    cellPhone,
    gender,
    maritalStatus,
    email,
    dateOfBirth,
  } = validatedFields.data;

  const existingLead = await db.lead.findUnique({
    where: {
      cellPhone: reFormatPhoneNumber(cellPhone),
    },
  });

  if (!homePhone) {
    homePhone == cellPhone;
  }

  const st = states.find(
    (e) =>
      e.state.toLowerCase() == state.toLowerCase() ||
      e.abv.toLowerCase() == state.toLowerCase()
  );

  const phoneNumbers = await db.phoneNumber.findMany({
    where: { agentId: user.id, status: { not: "Deactive" } },
  });

  const defaultNumber = phoneNumbers.find((e) => e.status == "Default");
  const phoneNumber = phoneNumbers.find((e) => e.state == st?.abv);
  let newLead;
  if (existingLead) {
    newLead = await db.leadDuplicates.create({
      data: {
        firstName,
        lastName,
        address,
        city,
        state: st?.abv || state,
        zipCode,
        homePhone: homePhone ? reFormatPhoneNumber(homePhone) : "",
        cellPhone: reFormatPhoneNumber(cellPhone),
        gender: gender,
        maritalStatus: maritalStatus,
        email,
        dateOfBirth,
        userId: user.id,
      },
    });
  } else {
    newLead = await db.lead.create({
      data: {
        firstName,
        lastName,
        address,
        city,
        state: st?.abv || state,
        zipCode,
        homePhone: homePhone ? reFormatPhoneNumber(homePhone) : "",
        cellPhone: reFormatPhoneNumber(cellPhone),
        gender: gender,
        maritalStatus: maritalStatus,
        email,
        dateOfBirth,
        defaultNumber: phoneNumber ? phoneNumber.phone : defaultNumber?.phone!,
        userId: user.id,
        height: "",
        weight: "",
      },
    });
  }
  return { success: newLead };
};

export const leadsImport = async (values: LeadSchemaType[]) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }
  let duplicates = 0;
  const phoneNumbers = await db.phoneNumber.findMany({
    where: { agentId: user.id, status: { not: "Deactive" } },
  });

  let assistant
  const assistantId=values[0].assistantId
  if(assistantId){
    assistant=(await db.user.findUnique({where:{id:assistantId}}))?.firstName
  }

  const defaultNumber = phoneNumbers.find((e) => e.status == "Default");
  for (let i = 0; i < values.length; i++) {
    const {
      firstName,
      lastName,
      address,
      city,
      state,
      zipCode,
      homePhone,
      cellPhone,
      gender,
      maritalStatus,
      email,
      dateOfBirth,
      weight,
      height,
      income,
      policyAmount,
      smoker,
      currentlyInsured,
      currentInsuranse,
      type,
      vendor,
      status,
      assistantId,
      recievedAt,
    } = values[i];

    const st = states.find(
      (e) =>
        e.state.toLowerCase() == state.toLowerCase() ||
        e.abv.toLowerCase() == state.toLowerCase()
    );
    const phoneNumber = phoneNumbers.find((e) => e.state == state);
    const existingLead = await db.lead.findUnique({ where: { cellPhone } });
    if (existingLead) {
      duplicates++;
      await db.leadDuplicates.create({
        data: {
          firstName,
          lastName,
          address,
          city,
          state: st?.abv ? st.abv : state,
          zipCode,
          homePhone,
          cellPhone,
          gender,
          maritalStatus,
          email,
          dateOfBirth,
          weight,
          height,
          income,
          policyAmount,
          smoker,
          currentlyInsured,
          currentInsuranse,
          type,
          vendor,
          recievedAt:
            Date.parse(recievedAt!) > 0 ? new Date(recievedAt!) : new Date(),
          userId: user?.id,
        },
      });
    } else {
      await db.lead.create({
        data: {
          firstName,
          lastName,
          address,
          city,
          state: st?.abv ? st.abv : state,
          zipCode,
          homePhone,
          cellPhone,
          gender,
          maritalStatus,
          email,
          dateOfBirth,
          weight,
          height,
          income,
          policyAmount,
          smoker,
          currentlyInsured,
          currentInsuranse,
          type,
          vendor,
          recievedAt:
            Date.parse(recievedAt!) > 0 ? new Date(recievedAt!) : new Date(),
          defaultNumber: phoneNumber
            ? phoneNumber.phone
            : defaultNumber?.phone!,
          userId: user?.id,
          status,
          assistantId
        },
      });
    }
  }
  return {
    success: `${values.length} Leads have been imported ${assistant&& `and assigned to ${assistant} ` } - duplicates(${duplicates})`,
  };
};

export const leadUpdateById = async (
  values: LeadSchemaType,
  leadId: string
) => {
  const existingLead = await db.lead.findUnique({ where: { id: leadId } });

  if (!existingLead) {
    return { error: "Lead does not exist" };
  }

  await db.lead.update({
    where: { id: existingLead.id },
    data: {
      ...values,
    },
  });

  return { success: "Lead has been updated" };
};

export const leadUpdateByIdDefaultNumber = async (
  id: string,
  defaultNumber: string
) => {
  const user = await currentUser();
  if (!user?.id || !user?.email) {
    return { error: "Unauthenticated" };
  }
  const existingLead = await db.lead.findUnique({ where: { id } });

  if (!existingLead) {
    return { error: "Lead does not exist" };
  }

  await db.lead.update({
    where: { id },
    data: {
      defaultNumber,
    },
  });

  activityInsert(
    id,
    "caller id",
    "Caller id updated",
    user.id,
    existingLead.defaultNumber
  );
  return { success: "Lead default number has been updated" };
};

export const leadUpdateByIdNotes = async (id: string, notes: string) => {
  const user = await currentUser();
  if (!user?.id || !user?.email) {
    return { error: "Unauthenticated" };
  }
  const existingLead = await db.lead.findUnique({ where: { id } });

  if (!existingLead) {
    return { error: "Lead does not exist" };
  }

  const newNote = await db.lead.update({
    where: { id },
    data: {
      notes,
    },
    select: { id: true, notes: true },
  });

  activityInsert(
    id,
    "notes",
    "Notes updated",
    user.id,
    existingLead.notes as string
  );
  return { success: newNote };
  // return { success: "Lead notes have been updated" };
};

export const leadUpdateByIdQuote = async (id: string, quote: string) => {
  const user = await currentUser();
  if (!user?.id || !user?.email) {
    return { error: "Unauthenticated" };
  }
  const existingLead = await db.lead.findUnique({ where: { id } });

  if (!existingLead) {
    return { error: "Lead does not exist" };
  }

  if (user.id != existingLead.userId) {
    return { error: "Unauthorized" };
  }

  await db.lead.update({
    where: { id },
    data: {
      quote,
    },
  });
  activityInsert(id, "Quote", "Quote updated", user.id, existingLead.quote);
  return { success: "Lead quote has been updated" };
};

export const leadUpdateByIdType = async (leadId: string, type: string) => {
  const user = await currentUser();
  if (!user?.id || !user?.email) {
    return { error: "Unauthenticated" };
  }
  const existingLead = await db.lead.findUnique({ where: { id: leadId } });

  if (!existingLead) {
    return { error: "Lead does not exist" };
  }
  if (user.id != existingLead.userId) {
    return { error: "Unauthorized" };
  }
  await db.lead.update({
    where: { id: leadId },
    data: {
      type,
    },
  });
  activityInsert(leadId, "Type", "Type updated", user.id, existingLead.type);
  return { success: "Lead type has been updated" };
};

export const leadUpdateByIdStatus = async (leadId: string, status: string) => {
  const user = await currentUser();

  if (!user?.id || !user?.email) {
    return { error: "Unauthenticated" };
  }

  let userId = user.id;
  if (user.role == "ASSISTANT") {
    userId = (await userGetByAssistant(userId)) as string;
  }
  const existingLead = await db.lead.findUnique({ where: { id: leadId } });

  if (!existingLead) {
    return { error: "Lead does not exist" };
  }

  if (userId != existingLead.userId) {
    return { error: "Unauthorized" };
  }

  await db.lead.update({
    where: { id: leadId },
    data: {
      status,
    },
  });
  activityInsert(
    leadId,
    "status",
    "Status updated",
    user.id,
    existingLead.status
  );
  return { success: "Lead status has been updated" };
};

export const leadUpdateByIdMainInfo = async (values: LeadMainSchemaType) => {
  const validatedFields = LeadMainSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { id, firstName, lastName, email, address, city, state, zipCode } =
    validatedFields.data;
  const user = await currentUser();
  if (!user?.id || !user?.email) {
    return { error: "Unauthenticated" };
  }
  const existingLead = await db.lead.findUnique({ where: { id } });

  if (!existingLead) {
    return { error: "Lead does not exist" };
  }

  if (user.id != existingLead.userId) {
    return { error: "Unauthorized" };
  }

  const leadInfo = await db.lead.update({
    where: { id },
    data: {
      firstName,
      lastName,
      email,
      address,
      city,
      state,
      zipCode,
    },
  });
  activityInsert(leadInfo.id!, "main", "Main info updated", user.id);
  return { success: leadInfo };
};
export const leadUpdateByIdGeneralInfo = async (
  values: LeadGeneralSchemaType
) => {
  const validatedFields = LeadGeneralSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const {
    id,
    gender,
    maritalStatus,
    dateOfBirth,
    weight,
    height,
    income,
    smoker,
  } = validatedFields.data;
  const user = await currentUser();
  if (!user?.id || !user?.email) {
    return { error: "Unauthenticated" };
  }
  const existingLead = await db.lead.findUnique({ where: { id } });

  if (!existingLead) {
    return { error: "Lead does not exist" };
  }

  if (user.id != existingLead.userId) {
    return { error: "Unauthorized" };
  }
  let dob = dateOfBirth;
  if (dob) {
    dob = new Date(dob).toString();
  }
  const leadInfo = await db.lead.update({
    where: { id },
    data: {
      gender,
      maritalStatus,
      dateOfBirth: dob,
      weight,
      height,
      income,
      smoker,
    },
  });
  activityInsert(leadInfo.id!, "general", "General info updated", user.id);
  return { success: leadInfo };
};
export const leadUpdateByIdPolicyInfo = async (
  values: LeadPolicySchemaType
) => {
  const validatedFields = LeadPolicySchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const {
    leadId,
    carrier,
    policyNumber,
    status,
    ap,
    commision,
    coverageAmount,
    startDate,
  } = validatedFields.data;

  const user = await currentUser();
  if (!user?.id || !user?.email) {
    return { error: "Unauthenticated" };
  }
  const existingLead = await db.lead.findUnique({ where: { id: leadId } });

  if (!existingLead) {
    return { error: "Lead does not exist" };
  }

  if (user.id != existingLead.userId) {
    return { error: "Unauthorized" };
  }
  if (parseInt(ap) > 0) {
    await db.lead.update({
      where: { id: leadId },
      data: { status: "Sold", assistant: { disconnect: true } },
    });
  }
  const existingPolicy = await db.leadPolicy.findUnique({ where: { leadId } });
  let leadPolicyInfo;
  if (!existingPolicy) {
    leadPolicyInfo = await db.leadPolicy.create({
      data: {
        leadId,
        carrier,
        policyNumber,
        status,
        ap,
        commision,
        coverageAmount,
        startDate,
      },
    });
  } else {
    leadPolicyInfo = await db.leadPolicy.update({
      where: { leadId },
      data: {
        carrier,
        policyNumber,
        ap,
        commision,
        coverageAmount,
        startDate,
      },
    });
  }
  activityInsert(leadPolicyInfo.leadId, "sale", "policy info updated", user.id);
  return { success: leadPolicyInfo };
};

//LEAD BENFICIARIES
export const leadBeneficiaryInsert = async (
  values: LeadBeneficiarySchemaType
) => {
  const validatedFields = LeadBeneficiarySchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const {
    leadId,
    type,
    relationship,
    firstName,
    lastName,
    address,
    city,
    state,
    zipCode,
    cellPhone,
    gender,
    email,
    dateOfBirth,
    share,
    ssn,
    notes,
  } = validatedFields.data;

  const existingBeneficiery = await db.leadBeneficiary.findFirst({
    where: {
      leadId,
      firstName,
    },
  });

  if (existingBeneficiery) {
    return { error: "Benficiary already exists!" };
  }

  const newBeneficiary = await db.leadBeneficiary.create({
    data: {
      leadId,
      type,
      relationship,
      firstName,
      lastName,
      address,
      city,
      state: state as string,
      zipCode,
      cellPhone: reFormatPhoneNumber(cellPhone as string),
      gender: gender,
      email,
      dateOfBirth,
      share,
      ssn,
      notes,
    },
  });
  await activityInsert(
    leadId,
    "Beneficiary",
    "Beneficiary Added",
    user.id,
    firstName
  );
  return { success: newBeneficiary };
};
export const leadBeneficiaryUpdateById = async (
  values: LeadBeneficiarySchemaType
) => {
  const validatedFields = LeadBeneficiarySchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const {
    id,
    type,
    relationship,
    firstName,
    lastName,
    address,
    city,
    state,
    zipCode,
    cellPhone,
    gender,
    email,
    dateOfBirth,
    share,
    ssn,
    notes,
  } = validatedFields.data;

  const existingBeneficiery = await db.leadBeneficiary.findUnique({
    where: {
      id,
    },
  });

  if (!existingBeneficiery) {
    return { error: "Benficiary does not exists!" };
  }

  const modifiedBeneficiary = await db.leadBeneficiary.update({
    where: { id },
    data: {
      type,
      relationship,
      firstName,
      lastName,
      address,
      city,
      state,
      zipCode,
      cellPhone: reFormatPhoneNumber(cellPhone as string),
      gender: gender,
      email,
      dateOfBirth,
      share,
      ssn,
      notes,
    },
  });
  return { success: modifiedBeneficiary };
};

export const leadBeneficiaryDeleteById = async (id: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const existingBeneficiery = await db.leadBeneficiary.findUnique({
    where: {
      id,
    },
  });

  if (!existingBeneficiery) {
    return { error: "Benficiary does not exists!" };
  }

  const modifiedBeneficiary = await db.leadBeneficiary.delete({
    where: { id },
  });

  await activityInsert(
    modifiedBeneficiary.leadId,
    "Beneficiary",
    "Beneficiary Removed",
    user.id,
    modifiedBeneficiary.firstName
  );

  return { success: "Beneficiary Deleted" };
};

//LEAD MEDICAL CONDITIONS
export const leadConditionInsert = async (values: LeadConditionSchemaType) => {
  const validatedFields = LeadConditionSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { leadId, conditionId, diagnosed, medications, notes } =
    validatedFields.data;

  const user = await currentUser();

  if (!user) {
    return { error: "Unathenticated" };
  }

  const existingLead = await db.lead.findUnique({ where: { id: leadId } });
  if (!existingLead) {
    return { error: "Lead does not exists" };
  }

  const existingCondition = await db.leadMedicalCondition.findFirst({
    where: { leadId: conditionId },
  });
  if (existingCondition) {
    return { error: "Lead condition already exists" };
  }

  const newLeadCondition = await db.leadMedicalCondition.create({
    data: { leadId, conditionId, diagnosed, medications, notes },
    include: { condition: true },
  });
  await activityInsert(
    leadId,
    "Condition",
    "Condition created",
    user.id,
    newLeadCondition.condition.name
  );
  return { success: newLeadCondition };
};

export const leadConditionUpdateById = async (
  values: LeadConditionSchemaType
) => {
  const validatedFields = LeadConditionSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const { id, conditionId, diagnosed, medications, notes } =
    validatedFields.data;

  const existingCondition = await db.leadMedicalCondition.findUnique({
    where: {
      id,
    },
  });

  if (!existingCondition) {
    return { error: "Condition does not exists!" };
  }

  const modifiedCondition = await db.leadMedicalCondition.update({
    where: { id },
    data: {
      conditionId,
      diagnosed,
      medications,
      notes,
    },
    include: { condition: true },
  });
  return { success: modifiedCondition };
};

export const leadConditionDeleteById = async (id: string) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unathenticated" };
  }

  const existingCondition = await db.leadMedicalCondition.findUnique({
    where: { id },
  });
  if (!existingCondition) {
    return { error: "Condition no longer exists" };
  }

  await db.leadMedicalCondition.delete({
    where: { id },
  });
  await activityInsert(
    existingCondition.leadId,
    "Condition",
    "Condition deleted",
    user.id
  );
  return { success: "Condition deleted!" };
};

//LEAD EXPENSES
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

//LEAD ASSISTANT AND SHARE
export const leadUpdateByIdAsssitant = async (
  id: string,
  assistantId: string | null | undefined
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unathenticated" };
  }

  if (!assistantId) {
    await db.lead.update({
      where: { id },
      data: {
        assistant: { disconnect: true },
      },
    });
    return { success: "Assistant has been removed from the lead!" };
  }
  await db.lead.update({
    where: { id },
    data: {
      assistantId: assistantId,
    },
  });

  return { success: "Assistant has been added to the lead!" };
};
export const leadUpdateByIdShare = async (
  id: string,
  userId: string | null | undefined
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unathenticated" };
  }

  if (!userId) {
    await db.lead.update({
      where: { id },
      data: {
        sharedUser: { disconnect: true },
      },
    });
    return { success: "Lead sharing has been deactivated!" };
  }
  await db.lead.update({
    where: { id },
    data: {
      sharedUserId: userId,
    },
  });

  return { success: " Lead is now shared!" };
};
