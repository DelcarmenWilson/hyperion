"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

import {
  LeadExportSchemaType,
  LeadGeneralSchema,
  LeadGeneralSchemaType,
  LeadMainSchema,
  LeadMainSchemaType,
  LeadPolicySchema,
  LeadPolicySchemaType,
  LeadSchema,
  LeadSchemaType,
} from "@/schemas/lead";

import { activityInsert } from "../activity";
import { userGetByAssistant } from "@/data/user";

import { reFormatPhoneNumber } from "@/formulas/phones";
import { states } from "@/constants/states";
import {
  formatTimeZone,
  getEntireDay,
} from "@/formulas/dates";
import { FullLead } from "@/types";
import { generateTextCode } from "@/formulas/phone";
import { feedInsert } from "../feed";

//LEAD

//DATA
export const leadsGetAll = async () => {
  try {
    const leads = await db.lead.findMany({ include: { conversations: true } });

    return leads;
  } catch {
    return [];
  }
};

export const leadsGetAllByAgentId = async (userId: string) => {
  try {
    const leads = await db.lead.findMany({
      where: {
        OR: [{ userId }, { assistantId: userId }, { sharedUserId: userId }],
      },
      include: {
        conversations: {where:{agentId:userId}},
        appointments: { where: { status: "scheduled" } },
        calls: true,
        activities: true,
        beneficiaries: true,
        expenses: true,
        conditions: { include: { condition: true } },
        policy: true,
        assistant: true,
        sharedUser: true,
      },
    });
    const currentTime = new Date();
    const fullLeads: FullLead[] = leads.map((lead) => {
      const timeZone =
        states.find(
          (e) => e.abv.toLocaleLowerCase() == lead.state.toLocaleLowerCase()
        )?.zone || "US/Eastern";
      return {
        ...lead,
        conversation:lead.conversations[0],
        zone: timeZone,
        time: formatTimeZone(currentTime, timeZone),
      };
    });

    return fullLeads;
  } catch {
    return [];
  }
};

export const leadsGetAllByAgentIdFiltered = async (
  values: LeadExportSchemaType
) => {
  try {
    const { userId, to, from, state, vendor } = values;

    const leads = await db.lead.findMany({
      where: {
        userId,
        state: state != "All" ? state : undefined,
        vendor: vendor != "All" ? vendor : undefined,
        createdAt: { lte: to, gte: from },
      },
      //where: { userId: userId },
      // include: {
      //   conversation: true,
      //   appointments: { where: { status: "scheduled" } },
      //   calls: true,
      //   activities: true,
      //   beneficiaries: true,
      //   expenses: true,
      //   conditions: { include: { condition: true } },
      // },
    });
    return leads;
  } catch {
    return [];
  }
};

export const leadGetById = async (id: string) => {
  try {
    const lead = await db.lead.findUnique({
      where: {
        id,
      },
      include: {
        conversations: true,
        appointments: { orderBy: { startDate: "desc" } },
        calls: {
          where: { status: "completed" },
          orderBy: { createdAt: "desc" },
        },
        activities: { orderBy: { createdAt: "desc" } },
        expenses: true,
        beneficiaries: true,
        conditions: { include: { condition: true } },
        policy: true,
        assistant: true,
        sharedUser: true,
      },
    });
    return lead;
  } catch {
    return null;
  }
};
export const leadGetByPhone = async (cellPhone: string) => {
  try {
    const lead = await db.lead.findFirst({
      where: {
        cellPhone,
      },
      include: {
        conversations: true,
        appointments: { orderBy: { startDate: "desc" } },
        calls: {
          where: { status: "completed" },
          orderBy: { createdAt: "desc" },
        },
        activities: { orderBy: { createdAt: "desc" } },
        expenses: true,
        beneficiaries: true,
        conditions: { include: { condition: true } },
        policy: true,
      },
    });

    return lead;
  } catch {
    return null;
  }
};

export const leadGetPrevNextById = async (id: string) => {
  try {
    const user = await currentUser();
    if (!user) return null;
    let userId = user.id;
    if (user.role == "ASSISTANT") {
      userId = (await userGetByAssistant(userId)) as string;
    }
    const prev = await db.lead.findMany({
      take: 1,
      select: { id: true },
      where: {
        userId,
        id: {
          lt: id,
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    const next = await db.lead.findMany({
      take: 1,
      select: { id: true },
      where: {
        userId,
        id: {
          gt: id,
        },
      },
      orderBy: {
        id: "asc",
      },
    });
    return { prev: prev[0]?.id || null, next: next[0]?.id || null };
  } catch {
    return null;
  }
};

export const leadsGetByAgentIdTodayCount = async (userId: string) => {
  try {
    const date = getEntireDay();
    const leads = await db.lead.aggregate({
      _count: { id: true },
      where: {
        userId,
        createdAt: { gte: date.start },
      },
    });

    return leads._count.id;
  } catch {
    return 0;
  }
};
//ACTIONS
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
    ///Gnerate a new Text code
    let code = generateTextCode(firstName, lastName, cellPhone);

    //If the textcode already exist in the db generate a new text code with the first 4 digitis of the phone number
    const exisitingCode = await db.lead.findFirst({
      where: { textCode: code },
    });
    if (exisitingCode) {
      code = generateTextCode(firstName, lastName, cellPhone, true);
    }

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
        textCode: code,
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

  let assistant;
  const assistantId = values[0].assistantId;
  if (assistantId) {
    assistant = (await db.user.findUnique({ where: { id: assistantId } }))
      ?.firstName;
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
          assistantId,
        },
      });
    }
  }
  return {
    success: `${values.length} Leads have been imported ${
      assistant && `and assigned to ${assistant} `
    } - duplicates(${duplicates})`,
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
export const leadUpdateByIdMainInfo = async (values: LeadMainSchemaType) => {
  const validatedFields = LeadMainSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const {
    id,
    firstName,
    lastName,
    cellPhone,
    email,
    address,
    city,
    state,
    zipCode,
  } = validatedFields.data;
  const user = await currentUser();
  if (!user?.id || !user?.email) {
    return { error: "Unauthenticated" };
  }
  const existingLead = await db.lead.findUnique({ where: { id } });

  if (!existingLead) {
    return { error: "Lead does not exist" };
  }

  if (![existingLead.userId, existingLead.assistantId].includes(user.id)) {
    return { error: "Unauthorized" };
  }

  const leadInfo = await db.lead.update({
    where: { id },
    data: {
      firstName,
      lastName,
      cellPhone: reFormatPhoneNumber(cellPhone),
      email,
      address,
      city,
      state,
      zipCode,
    },
  });
  activityInsert(leadInfo.id!, "main", "Main info updated", user.id);
  return { success: leadInfo as LeadMainSchemaType };
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

  if (![existingLead.userId, existingLead.assistantId].includes(user.id)) {
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
  return { success: leadInfo as LeadGeneralSchemaType };
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

//LEAD ASSISTANT SHARE AND TRANSFER
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
export const leadUpdateByIdShare = async (id: string, userId: string) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unathenticated" };
  }

  const lead = await db.lead.findUnique({ where: { id } });
  if (!lead) {
    return { error: "Lead does not exists!!" };
  }

  if (lead.userId != user.id) {
    return { error: "Unauthorized!!" };
  }

  const sharedUser = await db.user.findUnique({ where: { id: userId } });
  if (!sharedUser) {
    return { error: "User does not exists!!" };
  }
  const sharedLead = await db.lead.update({
    where: { id },
    data: {
      sharedUserId: sharedUser.id,
    },
  });

    //MINE Feed
    feedInsert( `You shared a lead: ${lead.firstName} with ${sharedUser?.firstName}`,"",user.id,true)
    //Next Agent Feed
    feedInsert( `${user.name} shared a lead: ${lead.firstName} with you`,`/leads/${lead.id}`,sharedUser?.id as string)

  return {
    success: sharedLead.firstName,
    message: `Lead is now shared with ${sharedUser.firstName}!`,
  };
};
export const leadUpdateByIdUnShare = async (id: string) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unathenticated" };
  }

  const lead = await db.lead.findUnique({ where: { id } });
  if (!lead) {
    return { error: "Lead does not exists!!" };
  }

  if (lead.userId != user.id) {
    return { error: "Unauthorized!!" };
  }
  const sharedUser = await db.user.findUnique({
    where: { id: lead.sharedUserId as string },
  });
  const unsharedLead = await db.lead.update({
    where: { id },
    data: {
      sharedUser: { disconnect: true },
    },
  });

  //MINE Feed
  feedInsert(
    `You unshared a lead: ${lead.firstName} with ${sharedUser?.firstName}`,
    "",
    user.id,
    true
  );
  //Next Agent Feed
  feedInsert(
    `${user.name} unshared a lead: ${lead.firstName} with you`,
    "",
    sharedUser?.id as string
  );

  return {
    success: unsharedLead.firstName,
    message: "Lead sharing has been deactivated!",
  };
};
export const leadUpdateByIdTransfer = async (id: string, userId: string) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unathenticated" };
  }

  const lead = await db.lead.findUnique({ where: { id } });
  if (!lead) {
    return { error: "Lead does not exists!!" };
  }
  const tfUser = await db.user.findUnique({
    where: { id: userId },
    include: { phoneNumbers: true },
  });

  if (!tfUser) {
    return { error: "User does not exists!!" };
  }
  if (lead.userId != user.id) {
    return { error: "Unauthorized!!" };
  }
  const st = states.find(
    (e) =>
      e.state.toLowerCase() == lead.state.toLowerCase() ||
      e.abv.toLowerCase() == lead.state.toLowerCase()
  );
  const defaultNumber = tfUser.phoneNumbers.find((e) => e.status == "Default");
  const phoneNumber = tfUser.phoneNumbers.find((e) => e.state == st?.abv);

  await db.lead.update({
    where: { id },
    data: {
      sharedUser: { disconnect: true },
      assistant: { disconnect: true },
    },
  });

  const transferendLead = await db.lead.update({
    where: { id },
    data: {
      userId: tfUser.id,
      defaultNumber: phoneNumber ? phoneNumber.phone : defaultNumber?.phone,
    },
  });


  //MINE Feed
  feedInsert( `You transfered ${lead.firstName}'s information to ${transferendLead?.firstName}`,"",user.id,true)
  //Next Agent Feed
  feedInsert( `${user.name} transfered ${lead.firstName}'s information to you`,`/leads/${lead.id}`,transferendLead?.id as string)

  return {
    success: transferendLead.firstName,
    message: `Lead is now transfered to ${tfUser.firstName}!`,
  };
};
