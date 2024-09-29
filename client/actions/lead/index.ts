"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

import { FullLead } from "@/types";
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

import { leadActivityInsert } from "./activity";
import { userGetByAssistant } from "@/actions/user";

import { reFormatPhoneNumber } from "@/formulas/phones";
import { states } from "@/constants/states";
import { formatTimeZone, getAge, getEntireDay } from "@/formulas/dates";
import { generateTextCode } from "@/formulas/phone";
import { feedInsert } from "../feed";
import { bluePrintWeekUpdateByUserIdData } from "../blueprint/blueprint-week";
import { chatSettingGetTitan } from "../settings/chat";

//LEAD

//DATA
// export const leadsGetAll = async () => {
//   try {
//     const leads = await db.lead.findMany({ include: { conversations: true } });

//     return leads;
//   } catch {
//     return [];
//   }
// };

export const leadsGetAll = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return [];
    }

    const leads = await db.lead.findMany({
      where: {
        OR: [
          { userId: user.id },
          { assistantId: user.id },
          { sharedUserId: user.id },
        ],
      },
      include: {
        conversations: { where: { agentId: user.id } },
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
        conversation: lead.conversations[0],
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
//SPLIT DATA FOR EASIER PROCESSING
export const leadGetByIdBasicInfo = async (id: string) => {
  try {
    const user = await currentUser();
    if (!user) return null;
    const lead = await db.lead.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        status: true,
        gender:true,
        maritalStatus:true,
        calls: { where: { direction: "outbound" } },
        conversations: { where: { agentId: user.id } },
        userId: true,
        sharedUserId: true,
        state: true,
        appointments: { where: { status: "Scheduled" } },
        cellPhone: true,
        defaultNumber: true,
      },
    });
    return lead;
  } catch {
    return null;
  }
};
export const leadGetByIdMain = async (id: string) => {
  try {
    const lead = await db.lead.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        cellPhone: true,
        email: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        status: true,
        quote: true,
        textCode: true,
      },
    });
    return lead;
  } catch {
    return null;
  }
};
export const leadGetByIdGeneral = async (id: string) => {
  try {
    const lead = await db.lead.findUnique({
      where: {
        id,
      },
      include: {
        appointments: {
          where: { status: "Scheduled" },
          orderBy: { startDate: "desc" },
        },
        calls: {
          where: { status: "completed" },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    return lead;
  } catch {
    return null;
  }
};
export const leadGetByIdPolicy = async (id: string) => {
  try {
    const leadPolicy = await db.lead.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        assistant: true,
        policy: true,
      },
    });
    return leadPolicy;
  } catch {
    return null;
  }
};
export const leadGetByIdNotes = async (id: string) => {
  try {
    const leadNotes = await db.lead.findUnique({
      where: {
        id,
      },
      include: {
        sharedUser: true,
      },
    });
    return leadNotes;
  } catch {
    return null;
  }
};
export const leadGetByIdCallInfo = async (id: string) => {
  try {
    const leadNotes = await db.lead.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        status: true,
        type: true,
        calls: { where: { direction: "outbound" } },
      },
    });
    return leadNotes;
  } catch {
    return null;
  }
};

export const leadGetByConversationId = async (id: string) => {
  try {
    const conversation = await db.leadConversation.findUnique({
      where: { id },
    });
    if (!conversation) return null;

    const lead = await db.lead.findUnique({
      where: {
        id: conversation.leadId,
      },
      include: {
        calls: true,
        appointments: true,
        activities: true,
        beneficiaries: true,
        expenses: true,
        conditions: { include: { condition: true } },
        policy: true,
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
    const userId = await userGetByAssistant();
    if(!userId) return null
    const prev = (
      await db.lead.findMany({
        take: 1,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          state: true,
          dateOfBirth: true,
        },
        where: {
          userId,
          id: {
            lt: id,
          },
        },
        orderBy: {
          id: "desc",
        },
      })
    )[0];

    const next = (
      await db.lead.findMany({
        take: 1,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          state: true,
          dateOfBirth: true,
        },
        where: {
          userId,
          id: {
            gt: id,
          },
        },
        orderBy: {
          id: "asc",
        },
      })
    )[0];

    return {
      prev: prev
        ? {
            id: prev.id,
            name: `${prev.firstName} ${prev.lastName}`,
            state: prev.state,
            age: getAge(prev.dateOfBirth),
          }
        : null,
      next: next
        ? {
            id: next.id,
            name: `${next.firstName} ${next.lastName}`,
            state: next.state,
            age: getAge(next.dateOfBirth),
          }
        : null,
    };
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

export const leadGetOrCreateByPhoneNumber = async (
  cellPhone: string,
  state: string,
  agentId: string
) => {
  //Check if lead already exist
  const exisitingLead = await db.lead.findUnique({ where: { cellPhone } });

  //If there is an exisiting lead just return this lead details.
  if (exisitingLead) return exisitingLead;

  //Get a list of all the active phonenumbers for this particular agent
  const phoneNumbers = await db.phoneNumber.findMany({
    where: { agentId, status: { not: "Deactive" } },
  });
  //Get the default number from the list of active agent numbers
  const defaultNumber = phoneNumbers.find((e) => e.status == "Default");

  //Get the default number to be assinged to this lead
  const phoneNumber = phoneNumbers.find((e) => e.state == state);

  const st = states.find(
    (e) =>
      e.state.toLowerCase() == state.toLowerCase() ||
      e.abv.toLowerCase() == state.toLowerCase()
  );

  const firstName = "New";
  let lastName = "Lead";

  //Geta new TextCode a code based on lead infomation
  const textCode = await getNewTextCode(firstName, lastName, cellPhone); //Get titan (autoChat) from chat settings
  const titan = await chatSettingGetTitan(agentId);

  //Create a new Lead
  const newLead = await db.lead.create({
    data: {
      firstName,
      lastName,
      address: "",
      city: "",
      state: st?.abv ? st.abv : state,
      zipCode: "",
      homePhone: cellPhone,
      cellPhone,
      gender: "NA",
      maritalStatus: "Single",
      email: "",
      dateOfBirth: "",
      weight: "",
      height: "",
      income: "",
      policyAmount: "",
      smoker: false,
      currentlyInsured: false,
      currentInsuranse: "",
      type: "General",
      vendor: "Manually Created",
      recievedAt: new Date(),
      defaultNumber: phoneNumber ? phoneNumber.phone : defaultNumber?.phone!,
      userId: agentId,
      status: "New",
      textCode,
      titan,
    },
  });

  return newLead;
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
    //Get a new new Text code
    const textCode = await getNewTextCode(firstName, lastName, cellPhone);
    //Get titan (autoChat) from chat settings
    const titan = await chatSettingGetTitan(user.id);

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
        textCode,
        titan,
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
      notes,
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
      //Get New Text Code
      const textCode = await getNewTextCode(firstName, lastName, cellPhone);
      //Get titan (autoChat) from chat settings
      const titan = await chatSettingGetTitan(user.id);

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
          notes,
          textCode,
          titan,
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

  leadActivityInsert(
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

  leadActivityInsert(
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
  leadActivityInsert(id, "Quote", "Quote updated", user.id, existingLead.quote);
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
  leadActivityInsert(
    leadId,
    "Type",
    "Type updated",
    user.id,
    existingLead.type
  );
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
  leadActivityInsert(leadInfo.id!, "main", "Main info updated", user.id);
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
  leadActivityInsert(leadInfo.id!, "general", "General info updated", user.id);
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
  if (!user?.id || !user?.email) 
    return { error: "Unauthenticated" };
  
  const existingLead = await db.lead.findUnique({ where: { id: leadId } });

  if (!existingLead) 
    return { error: "Lead does not exist" };
  

  if (user.id != existingLead.userId) {
    return { error: "Unauthorized" };
  }
  let diff = parseInt(ap);
  if (diff > 0) {
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

    const exAp = parseInt(existingPolicy.ap);

    diff -= exAp;
  }

  bluePrintWeekUpdateByUserIdData(user.id, "premium", diff);
  leadActivityInsert(
    leadPolicyInfo.leadId,
    "sale",
    "policy info updated",
    user.id
  );
  return { success: leadPolicyInfo };
};

export const leadUpdateByIdAutoChat = async (
  id: string,
  titan: boolean
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthenticated!" };
  }
  const existingLead = await db.lead.findUnique({ where: { id } });
 
  if (!existingLead) 
    return { error: "Lead does not exist!" };  

  if (existingLead.userId !== user.id) 
    return { error: "Unauthorized!" };
  
  await db.lead.update({ where: { id }, data: { titan } });

  return { success: `Titan chat has been turned ${titan ? "on" : "off"} ` };
};


//LEAD ASSISTANT SHARE AND TRANSFER
export const leadUpdateByIdAssistantAdd = async (
  id: string,
  assistantId: string
) => {
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
  const afUser = await db.user.findUnique({
    where: { id: assistantId },
  });

  if (!afUser) {
    return { error: "User does not exists!!" };
  }

  await db.lead.update({
    where: { id },
    data: {
      assistantId,
    },
  });

  //MINE Feed
  await feedInsert(
    `You gave ${afUser.firstName} access to  ${lead.firstName}'s information`,
    `/leads/${lead.id}`,
    user.id,
    true
  );
  //Next Agent Feed
  await feedInsert(
    `${user.name} gave you acces to ${lead.firstName}'s information`,
    `/leads/${lead.id}`,
    afUser.id
  );

  return {
    success: lead.firstName,
    message: `${afUser.firstName} now has access to  ${lead.firstName}'s information !`,
  };
};
export const leadUpdateByIdAssistantRemove = async (id: string) => {
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
  const afUser = await db.user.findUnique({
    where: { id: lead.assistantId as string },
  });

  if (!afUser) {
    return { error: "User does not exists!!" };
  }
  await db.lead.update({
    where: { id },
    data: {
      assistant: { disconnect: true },
    },
  });

  //MINE Feed
  await feedInsert(
    `You removed ${afUser.firstName} access to ${lead.firstName}'s information`,
    `/leads/${lead.id}`,
    user.id,
    true
  );

  return {
    success: lead.firstName,
    message: `${afUser.firstName} access to  ${lead.firstName}'s information has been revoked!`,
  };
};

export const leadUpdateByIdShare = async (ids: string[], userId: string) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unathenticated" };
  }

  const sharedUser = await db.user.findUnique({ where: { id: userId } });
  if (!sharedUser) {
    return { error: "User does not exists!!" };
  }

  for (let id of ids) {
    const lead = await db.lead.findUnique({ where: { id } });
    if (!lead) return { error: "Lead does not exists!!" };

    if (lead.userId != user.id) {
      return { error: "Unauthorized!!" };
    }

    await db.lead.update({
      where: { id },
      data: {
        sharedUserId: sharedUser.id,
      },
    });
  }

  const lead = await db.lead.findUnique({ where: { id: ids[0] } });
  if (ids.length == 1) {
    //MINE Feed
    feedInsert(
      `You shared a lead: ${lead?.firstName} with ${sharedUser?.firstName}`,
      "",
      user.id,
      true
    );
    //Next Agent Feed
    feedInsert(
      `${user.name} shared a lead: ${lead?.firstName} with you`,
      `/leads/${lead?.id}`,
      sharedUser?.id as string
    );
  } else {
    //MINE Feed
    await feedInsert(
      `You shared multiple leads with ${sharedUser?.firstName}`,
      "",
      user.id,
      true
    );
    //Next Agent Feed
    await feedInsert(
      `${user.name} transfered multiple leads to you`,
      "",
      sharedUser?.id
    );
  }

  return {
    success: lead?.firstName,
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

export const leadUpdateByIdTransfer = async (ids: string[], userId: string) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unathenticated" };
  }

  const tfUser = await db.user.findUnique({
    where: { id: userId },
    include: { phoneNumbers: true },
  });

  if (!tfUser) {
    return { error: "User does not exists!!" };
  }

  for (let id of ids) {
    const lead = await db.lead.findUnique({ where: { id } });
    if (!lead) {
      return { error: "Lead does not exists!!" };
    }
    if (lead.userId != user.id) {
      return { error: "Unauthorized!!" };
    }

    const st = states.find(
      (e) =>
        e.state.toLowerCase() == lead.state.toLowerCase() ||
        e.abv.toLowerCase() == lead.state.toLowerCase()
    );
    const defaultNumber = tfUser.phoneNumbers.find(
      (e) => e.status == "Default"
    );
    const phoneNumber = tfUser.phoneNumbers.find((e) => e.state == st?.abv);

    await db.lead.update({
      where: { id },
      data: {
        sharedUser: { disconnect: true },
        assistant: { disconnect: true },
      },
    });

    await db.lead.update({
      where: { id },
      data: {
        userId: tfUser.id,
        defaultNumber: phoneNumber ? phoneNumber.phone : defaultNumber?.phone,
      },
    });
  }
  const lead = await db.lead.findUnique({ where: { id: ids[0] } });
  if (ids.length == 1) {
    //MINE Feed
    await feedInsert(
      `You transfered ${lead?.firstName}'s information to ${tfUser.firstName}`,
      "",
      user.id,
      true
    );
    //Next Agent Feed
    await feedInsert(
      `${user.name} transfered ${lead?.firstName}'s information to you`,
      `/leads/${lead?.id}`,
      tfUser.id
    );
  } else {
    //MINE Feed
    await feedInsert(
      `You transfered multiple leads to ${tfUser.firstName}`,
      "",
      user.id,
      true
    );
    //Next Agent Feed
    await feedInsert(
      `${user.name} transfered multiple leads to you`,
      "",
      tfUser.id
    );
  }

  return {
    success: lead?.firstName,
    message: `Lead${ids.length > 1 ? "s are" : " is"} now transfered to ${
      tfUser.firstName
    }!`,
  };
};

//HELPER FUNCTIONS
export const leadGetOrInsert = async (
  values: LeadSchemaType,
  agentId: string
) => {
  //Validate the data passed in
  const validatedFields = LeadSchema.safeParse(values);
  //If the validation failed return an error and exit the function
  if (!validatedFields.success) return { error: "Invalid fields!" };

  //Destucture the data for easy manipulation
  const {
    id,
    firstName,
    lastName,
    state,
    cellPhone,
    gender,
    maritalStatus,
    email,dateOfBirth
  } = validatedFields.data;

  //Get the leads information if it already exist in the database
  const oldLead = await db.lead.findFirst({
    where: { OR: [{ cellPhone: reFormatPhoneNumber(cellPhone) }, { id }] },
  });
  //If lead information was found in the database return the leads id and exit the function
  if (oldLead) return { success: oldLead };

  //Get the state (USA) data based on the leads state
  const st = states.find((e) => e.state == state || e.abv == state);
  //Get a list of Phonnumbers associated with the agents account
  const phoneNumbers = await db.phoneNumber.findMany({
    where: { agentId, status: { not: "Deactive" } },
  });
  //Get the default number from the list of phonNumbers
  const defaultNumber = phoneNumbers.find((e) => e.status == "Default");
  //Get the number that matches the leads state
  const phoneNumber = phoneNumbers.find((e) => e.state == st?.abv);
  //Get new textCode
  const textCode = await getNewTextCode(firstName, lastName, cellPhone);
  //Get titan (autoChat) from chat settings
  const titan = await chatSettingGetTitan(agentId);
  //Try to insert the data in the database to create the lead
  const lead = await db.lead.create({
    data: {
      firstName,
      lastName,
      address:"N/A",
      city:"N/A",
      zipCode:"N/A",
      state: st?.abv || state,
      cellPhone: reFormatPhoneNumber(cellPhone),
      gender,
      maritalStatus,
      email,
      defaultNumber: phoneNumber ? phoneNumber.phone : defaultNumber?.phone!,
      userId: agentId,
      dateOfBirth,
      height: "",
      weight: "",
      textCode,
      titan,



      
     
      
     
      
    },
  });
  //if the lead was not generated return an error and exit the function
  if (!lead) return { error: "Could not create lead!" };
  //If everything passed return the lead id for the inserted record
  return { success: lead };
};

export const getNewTextCode = async (
  firstName: string,
  lastName: string,
  cellPhone: string
) => {
  //Generate a code based on lead infomation
  let code = generateTextCode(firstName, lastName, cellPhone);

  //Check if previously generate code already exist
  const exisitingCode = await db.lead.findFirst({
    where: { textCode: code },
  });

  //If the textcode already exist in the db generate a new text code with the first 4 digitis of the phone number
  if (exisitingCode)
    code = generateTextCode(firstName, lastName, cellPhone, true);
  return code;
};
