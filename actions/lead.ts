"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import {
  LeadBeneficiarySchema,
  LeadConditionSchema,
  LeadExpenseSchema,
  LeadGeneralSchema,
  LeadMainSchema,
  LeadSaleSchema,
  LeadSchema,
  LeadStatusSchema,
} from "@/schemas";
import { currentUser } from "@/lib/auth";
import { reFormatPhoneNumber } from "@/formulas/phones";
import { states } from "@/constants/states";
import { activityInsert } from "./activity";
import { defaultLeadExpenses } from "@/constants/lead";

export const leadInsert = async (values: z.infer<typeof LeadSchema>) => {
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
        state:st?.abv||state,
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
        state:st?.abv||state,
        zipCode,
        homePhone: homePhone ? reFormatPhoneNumber(homePhone) : "",
        cellPhone: reFormatPhoneNumber(cellPhone),
        gender: gender,
        maritalStatus: maritalStatus,
        email,
        dateOfBirth,
        defaultNumber: phoneNumber ? phoneNumber.phone : defaultNumber?.phone!,
        userId: user.id,
      },
    });
  }
  return { success: newLead };
};

export const leadsImport = async (values: z.infer<typeof LeadSchema>[]) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }
  let duplicates = 0;
  const phoneNumbers = await db.phoneNumber.findMany({
    where: { agentId: user.id, status: { not: "Deactive" } },
  });

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
        },
      });
    }
  }
  return {
    success: `${values.length} Leads have been imported - duplicates(${duplicates})`,
  };
};

export const leadUpdateById = async (
  values: z.infer<typeof LeadSchema>,
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

  await db.lead.update({
    where: { id },
    data: {
      notes,
    },
  });

  activityInsert(
    id,
    "notes",
    "Notes updated",
    user.id,
    existingLead.notes as string
  );
  return { success: "Lead notes have been updated" };
};

export const leadUpdateByIdQuote = async (id: string, quote: number) => {
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
  activityInsert(
    id,
    "Quote",
    "Quote updated",
    user.id,
    existingLead.quote.toString()
  );
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

export const leadUpdateByIdMainInfo = async (
  values: z.infer<typeof LeadMainSchema>
) => {
  const validatedFields = LeadMainSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { id, email, address, city, state, zipCode } = validatedFields.data;
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
  values: z.infer<typeof LeadGeneralSchema>
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

  const leadInfo = await db.lead.update({
    where: { id },
    data: {
      gender,
      maritalStatus,
      dateOfBirth,
      weight,
      height,
      income,
      smoker,
    },
  });
  activityInsert(leadInfo.id!, "general", "General info updated", user.id);
  return { success: leadInfo };
};
export const leadUpdateByIdSaleInfo = async (
  values: z.infer<typeof LeadSaleSchema>
) => {
  const validatedFields = LeadSaleSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { id, vendor, saleAmount, commision, costOfLead } =
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
  const status = saleAmount ? "Sold" : existingLead.status;
  const leadInfo = await db.lead.update({
    where: { id },
    data: {
      vendor,
      saleAmount,
      commision,
      costOfLead,
      status,
    },
  });
  activityInsert(leadInfo.id!, "sale", "Sale info updated", user.id);
  return { success: leadInfo };
};

//LEAD BENFICIARIES
export const leadBeneficiaryInsert = async (values: z.infer<typeof LeadBeneficiarySchema>) => {
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
    notes
  } = validatedFields.data;

  const existingBeneficiery = await db.leadBeneficiary.findFirst({
    where: {
      leadId,firstName
    },
  });

  if(existingBeneficiery){
    return {error:"Benficiary already exists!"}
  }
    
  const newBeneficiary = await db.leadBeneficiary.create({
      data: {
        leadId,
        type,
        firstName,
        lastName,
        address,
        city,
        state:state as string,
        zipCode,
        cellPhone: reFormatPhoneNumber(cellPhone as string),
        gender: gender,
        email,
        dateOfBirth,
        notes
      },
    });
    await activityInsert(leadId,"Beneficiary","Beneficiary Added",user.id,firstName)
  return { success: newBeneficiary };
};
export const leadBeneficiaryUpdateById = async (values: z.infer<typeof LeadBeneficiarySchema>) => {
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
    notes
  } = validatedFields.data;

  const existingBeneficiery = await db.leadBeneficiary.findUnique({
    where: {
      id
    },
  });

  if(!existingBeneficiery){
    return {error:"Benficiary does not exists!"}
  }
    
  const modifiedBeneficiary = await db.leadBeneficiary.update({where:{id},
      data: {
        type,
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
        notes
      },
    });
  return { success: modifiedBeneficiary };
};

export const leadBeneficiaryDeleteById = async (id:string) => {
  
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const existingBeneficiery = await db.leadBeneficiary.findUnique({
    where: {
      id
    },
  });

  if(!existingBeneficiery){
    return {error:"Benficiary does not exists!"}
  }
    
  const modifiedBeneficiary=await db.leadBeneficiary.delete({where:{id}});

  await activityInsert(modifiedBeneficiary.leadId,"Beneficiary","Beneficiary Removed",user.id,modifiedBeneficiary.firstName)

  return { success: "Beneficiary Deleted" };
};


//LEAD MEDICAL CONDITIONS
export const leadConditionInsert = async (
  values: z.infer<typeof LeadConditionSchema>
) => {
  const validatedFields = LeadConditionSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { leadId, conditionId,diagnosed,medications,notes } = validatedFields.data;

  const user = await currentUser();

  if (!user) {
    return { error: "Unathenticated" };
  }

  const existingLead = await db.lead.findUnique({ where: { id: leadId } });
  if (!existingLead) {
    return { error: "Lead does not exists" };
  }

  const existingCondition = await db.leadMedicalCondition.findFirst({ where: { leadId:conditionId } });
  if (existingCondition) {
    return { error: "Lead condition already exists" };
  }

  const newLeadCondition=  await db.leadMedicalCondition.create({
    data: {leadId, conditionId,diagnosed,medications,notes},include:{condition:true}
  });

  return { success: newLeadCondition };
};

export const leadConditionUpdateById =  async (values: z.infer<typeof LeadConditionSchema>) => {
    const validatedFields = LeadConditionSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }
    const user = await currentUser();
    if (!user) {
      return { error: "Unauthorized" };
    }
  
    const {
      id,conditionId,diagnosed,medications,notes
    } = validatedFields.data;
  
    const existingCondition = await db.leadMedicalCondition.findUnique({
      where: {
        id
      },
    });
  
    if(!existingCondition){
      return {error:"Condition does not exists!"}
    }
      
    const modifiedCondition = await db.leadMedicalCondition.update({where:{id},
        data: {
          conditionId,diagnosed,medications,notes
        },include:{condition:true}
      });
    return { success: modifiedCondition };
  };

export const leadConditionDeleteById = async (
  id: string) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unathenticated" };
  }

  const existingConditionExpense = await db.leadMedicalCondition.findUnique({ where: { id } });
  if (!existingConditionExpense) {
    return { error: "Condition no longer exists" };
  }

  await db.leadMedicalCondition.delete({
    where: { id },
  });

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
  const existingLeadExpenses = await db.leadExpense.findFirst();

  if (existingLeadExpenses) {
    return { error: "Lead Sheet already exists" };
  }

  let defaultExpenses = defaultLeadExpenses;
  defaultExpenses.forEach((e) => (e.leadId = leadId));

  await db.leadExpense.createMany({
    data: defaultExpenses,
  });

  const newLeadExpenses = await db.leadExpense.findMany({
    where: { id: leadId },
  });

  return { success: newLeadExpenses };
};
export const leadExpenseInsert = async (
  values: z.infer<typeof LeadExpenseSchema>
) => {
  const validatedFields = LeadExpenseSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { leadId, type, name, value,notes } = validatedFields.data;

  const user = await currentUser();

  if (!user) {
    return { error: "Unathenticated" };
  }

  const existingLead = await db.lead.findUnique({ where: { id: leadId } });
  if (!existingLead) {
    return { error: "Lead does not exists" };
  }

  const newLeadExpense=  await db.leadExpense.create({
    data: {leadId,type,name,value,notes},
  });

  return { success: newLeadExpense };
};

export const leadExpenseUpdateById = async (
  id: string,
  name: string,
  value: number
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unathenticated" };
  }

  const existingExpense = await db.leadExpense.findUnique({ where: { id } });
  if (!existingExpense) {
    return { error: "Expense no longer exists" };
  }

  const modifiedExpense = await db.leadExpense.update({
    where: { id },
    data: {
      name,
      value,
    },
  });

  return { success: `${modifiedExpense.type} updated!` };
};

export const leadExpenseDeleteById = async (
  id: string) => {
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

  return { success: `${deletedExpense.type} deleted!` };
};

// LEADSTATUS
export const leadStatusInsert = async (
  values: z.infer<typeof LeadStatusSchema>
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unathenticated" };
  }
  const validatedFields = LeadStatusSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { status, description } = validatedFields.data;

  const existingStatus = await db.leadStatus.findFirst({ where: { status } });
  if (existingStatus) {
    return { error: "Status already exists" };
  }

  const leadStatus = await db.leadStatus.create({
    data: {
      status,
      userId: user.id,
    },
  });

  return { success: leadStatus };
};
