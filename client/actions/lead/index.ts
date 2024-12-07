"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

import { AppointmentStatus } from "@/types/appointment";
import { AssociatedLead } from "@/types";
import { FullLead } from "@/types";
import { LeadActivityType } from "@/types/lead";
import { LeadDefaultStatus } from "@/types/lead";
import { NotificationReference } from "@/types/notification";

import {
  LeadExportSchemaType,
  LeadGeneralSchema,
  LeadGeneralSchemaType,
  LeadMainSchema,
  LeadMainSchemaType,
  LeadSchema,
  LeadSchemaType,
} from "@/schemas/lead";

import { getAssitantForUser } from "@/actions/user";
import { createNotification } from "../notification";
import { chatSettingGetTitan } from "../settings/chat";
import { createLeadActivity } from "./activity";

import { states } from "@/constants/states";
import { formatTimeZone } from "@/formulas/dates";
import { GetLeadOppositeRelationship } from "@/formulas/lead";
import { reFormatPhoneNumber } from "@/formulas/phones";
import { getAge, getEntireDay } from "@/formulas/dates";
import { generateTextCode } from "@/formulas/phone";

//TODO - need to come back and update the actions to a mutate call function
//LEAD
//DATA
export const getLeadsToExport = async (values: LeadExportSchemaType) => {
  const { userId, to, from, state, vendor } = values;

  return await db.lead.findMany({
    where: {
      userId,
      state: state != "All" ? state : undefined,
      vendor: vendor != "All" ? vendor : undefined,
      createdAt: { lte: to, gte: from },
    },
  });
};

export const getLead = async (id: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");
  return await db.lead.findUnique({
    where: {
      id,
    },
    include: {
      conversations: { where: { agentId: user.id } },
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
};
export const getLeads = async () => {
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
        NOT: { statusId: LeadDefaultStatus.DELETED },
      },
      include: {
        conversations: { where: { agentId: user.id } },
        appointments: { where: { status: "scheduled" } },
        calls: true,
        activities: true,
        beneficiaries: true,
        expenses: true,
        conditions: { include: { condition: true } },
        policy: { include: { carrier: true } },
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
        policy: { ...lead.policy },
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
export const getLeadByPhone = async (cellPhone: string) => {
  return  await db.lead.findFirst({
      where: {
        cellPhone,
      },
   select:{id:true,firstName:true,lastName:true}
    });

   
};
export const getMultipleLeads = async ({
  leadIds,
}: {
  leadIds: string[] | undefined;
}) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  return await db.lead.findMany({
    where: {
      id: { in: leadIds },
      OR: [
        { userId: user.id },
        { assistantId: user.id },
        { sharedUserId: user.id },
      ],
      NOT: { statusId: LeadDefaultStatus.DELETED },
    },
  });
};

//SPLIT DATA FOR EASIER PROCESSING
export const getLeadBasicInfo = async (id: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");
  return await db.lead.findUnique({
    where: {
      id,
      userId: user.id,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      statusId: true,
      gender: true,
      maritalStatus: true,
      calls: { where: { direction: "outbound" } },
      conversations: { where: { agentId: user.id } },
      userId: true,
      sharedUserId: true,
      state: true,
      appointments: {
        where: { status: AppointmentStatus.SCHEDULED, agentId: user.id },
      },
      cellPhone: true,
      defaultNumber: true,
      titan: true,
    },
  });
};
export const getLeadMainInfo = async (id: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");
  return await db.lead.findUnique({
    where: {
      id,
      userId: user.id,
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
      statusId: true,
      quote: true,
      textCode: true,
    },
  });
};
export const getLeadGeneralInfo = async (id: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");
  return await db.lead.findUnique({
    where: {
      id,
      userId: user.id,
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
};

export const getLeadNotes = async (id: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");
  return await db.lead.findUnique({
    where: {
      id,
      userId: user.id,
    },
    include: {
      sharedUser: true,
    },
  });
};
export const getLeadCallInfo = async (id: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");
  return await db.lead.findUnique({
    where: {
      id,
      userId: user.id,
    },
    select: {
      id: true,
      statusId: true,
      type: true,
      vendor: true,
      calls: { where: { direction: "outbound" } },
    },
  });
};

export const getLeadByConversation = async (id: string) => {
  const conversation = await db.leadConversation.findUnique({
    where: { id },
  });
  if (!conversation) return null;

  return await db.lead.findUnique({
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
};

export const getLeadPrevNext = async (id: string) => {
  try {
    const userId = await getAssitantForUser();
    if (!userId) throw new Error("Unauthenticated!");
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

export const getLeadsForUserToday = async (userId: string) => {
  const date = getEntireDay();
  const leads = await db.lead.aggregate({
    _count: { id: true },
    where: {
      userId,
      createdAt: { gte: date.start },
    },
  });

  return leads._count.id || 0;
};

export const getOrCreateLeadByPhoneNumber = async ({
  cellPhone,
  state,
  agentId,
}: {
  cellPhone: string;
  state: string;
  agentId: string;
}) => {
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
      textCode,
      titan,
    },
  });

  return newLead;
};

export const getAssociatedLeads = async (id: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");
  const leads = await db.leadsOnLeads.findMany({
    where: {
      OR: [{ leadOneId: id }, { leadTwoId: id }],
    },
    select: {
      leadOne: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          dateOfBirth: true,
          gender: true,
        },
      },
      leadTwo: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          dateOfBirth: true,
          gender: true,
        },
      },
      relationship: true,
    },
  });
  const endLeads: AssociatedLead[] = leads.map((l) =>
    l.leadOne.id == id
      ? {
          ...l.leadTwo,
          relationship: l.relationship,
        }
      : {
          ...l.leadOne,
          relationship: GetLeadOppositeRelationship(
            l.relationship,
            l.leadOne.gender
          ),
        }
  );
  return endLeads;
};

//ACTIONS
export const createLead = async (values: LeadSchemaType) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  const { success, data } = LeadSchema.safeParse(values);
  if (!success) throw new Error("Invalid fields!");

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
    associatedLead,
    relationship,
  } = data;

  const existingLead = await db.lead.findUnique({
    where: {
      cellPhone: reFormatPhoneNumber(cellPhone),
    },
  });

  if (!homePhone) homePhone == cellPhone;

  const st = states.find(
    (e) =>
      e.state.toLowerCase() == state.toLowerCase() ||
      e.abv.toLowerCase() == state.toLowerCase()
  );

  const phoneNumbers = await db.phoneNumber.findMany({
    where: { agentId: user.id, status: { not: "Deactive" } },
  });

  const defaultNumber =
    phoneNumbers.find((e) => e.status == "Default")?.phone || "999-999-9999";
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
        defaultNumber: phoneNumber ? phoneNumber.phone : defaultNumber,
        userId: user.id,
        height: "",
        weight: "",
        textCode,
        titan,
      },
    });

    if (associatedLead)
      await createLeadRelationship(
        associatedLead,
        newLead.id,
        relationship as string
      );
  }
  return { success: newLead, associated: !!associatedLead };
};
export const deleteLead = async (id: string) => {
  //get current logged in user
  const user = await currentUser();

  // check if there is no user. yes, return an error
  if (!user) return { error: "Unauthenticated!" };

  //get existing lead with the ID.
  const existingLead = await db.lead.findUnique({ where: { id } });
  // if there is no lead return an error
  if (!existingLead) return { error: "Lead does not exist!" };

  //if existing lead's agent id is not equal to userid returns an error
  if (user.id != existingLead.userId) return { error: "Unauthorized!" };

  //if doesn't fall under above conditions change lead status into deleted
  await db.lead.update({
    where: { id },
    data: { statusId: LeadDefaultStatus.DELETED },
  });
    
  // if everything is correct return success
  return { success: id };
};

export const importLleads = async (values: LeadSchemaType[]) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");
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
      statusId,
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
          statusId,
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

export const updateLeadUpdate = async (
  values: LeadSchemaType,
  leadId: string
) => {
  const existingLead = await db.lead.findUnique({ where: { id: leadId } });

  if (!existingLead) throw new Error("Lead does not exist");

  await db.lead.update({
    where: { id: existingLead.id },
    data: {
      ...values,
    },
  });

  return "Lead has been updated";
};

export const updateLeadDefaultNumber = async ({
  id,
  defaultNumber,
}: {
  id: string;
  defaultNumber: string;
}) => {
  const user = await currentUser();
  if (!user?.id || !user?.email) throw new Error("Unauthenticated!");

  const existingLead = await db.lead.findUnique({ where: { id } });

  if (!existingLead) throw new Error("Lead does not exists");

  await db.lead.update({
    where: { id },
    data: {
      defaultNumber,
    },
  });

  await createLeadActivity({
    leadId: id,
    type: LeadActivityType.CALLERID,
    activity: "Caller id updated",
    userId: user.id,
    newValue: existingLead.defaultNumber,
  });

  return "Lead default number has been updated";
};

export const updateLeadNotes = async ({
  id,
  notes,
}: {
  id: string;
  notes: string;
}) => {
  const user = await currentUser();
  if (!user?.id || !user?.email) throw new Error("Unauthenticated!");
  const existingLead = await db.lead.findUnique({ where: { id } });

  if (!existingLead) throw new Error("Lead does not exists");

  const newNote = await db.lead.update({
    where: { id },
    data: {
      notes,
    },
    select: { id: true, notes: true },
  });

  await createLeadActivity({
    leadId: id,
    type: LeadActivityType.NOTES,
    activity: "Notes updated",
    userId: user.id,
    newValue: existingLead.notes as string,
  });

  return { success: newNote };
};

export const updateLeadQuote = async ({
  id,
  quote,
}: {
  id: string;
  quote: string;
}) => {
  const user = await currentUser();
  if (!user?.id || !user?.email) throw new Error("Unauthenticated!");

  const existingLead = await db.lead.findUnique({ where: { id } });

  if (!existingLead) throw new Error("Lead does not exist");

  if (user.id != existingLead.userId) throw new Error("Unauthorized");

  await db.lead.update({
    where: { id },
    data: {
      quote,
    },
  });
  await createLeadActivity({
    leadId: id,
    type: LeadActivityType.QUOTE,
    activity: "Quote updated",
    userId: user.id,
    newValue: existingLead.quote,
  });
  return "Lead quote has been updated";
};

export const updateLeadType = async ({
  id,
  type,
}: {
  id: string;
  type: string;
}) => {
  const user = await currentUser();
  if (!user?.id || !user?.email) throw new Error("Unauthenticated!");
  const existingLead = await db.lead.findUnique({ where: { id } });

  if (!existingLead) throw new Error("Lead does not exist");

  if (user.id != existingLead.userId) throw new Error("Unauthorized");

  await db.lead.update({
    where: { id },
    data: {
      type,
    },
  });
  await createLeadActivity({
    leadId: id,
    type: LeadActivityType.TYPE,
    activity: "Type updated",
    userId: user.id,
    newValue: existingLead.type,
  });

  return "Lead type has been updated";
};

export const updateLeadMainInfo = async (values: LeadMainSchemaType) => {
  const user = await currentUser();
  if (!user?.id || !user?.email) throw new Error("Unauthenticated");

  const { success, data } = LeadMainSchema.safeParse(values);
  if (!success) throw new Error("Invalid fields!");

  const { id, cellPhone } = data;

  const existingLead = await db.lead.findUnique({ where: { id } });

  if (!existingLead) throw new Error("Lead does not exist");

  if (![existingLead.userId, existingLead.assistantId].includes(user.id))
    throw new Error("Unauthorized");

  const leadInfo = await db.lead.update({
    where: { id },
    data: {
      ...data,
      cellPhone: reFormatPhoneNumber(cellPhone),
    },
  });
  if (!leadInfo) throw new Error("Something went wrong!");

  await createLeadActivity({
    leadId: leadInfo.id,
    type: LeadActivityType.MAIN,
    activity: "Main info updated",
    userId: user.id,
  });
  return leadInfo as LeadMainSchemaType;
};

export const updateLeadGeneralInfo = async (values: LeadGeneralSchemaType) => {
  const { success, data } = LeadGeneralSchema.safeParse(values);
  if (!success) throw new Error("Invalid fields!");

  const user = await currentUser();
  if (!user?.id || !user?.email) throw new Error("Unauthenticated!");

  const existingLead = await db.lead.findUnique({ where: { id: data.id } });

  if (!existingLead) throw new Error("Lead does not exist");

  if (![existingLead.userId, existingLead.assistantId].includes(user.id))
    throw new Error("Unauthorized");

  const leadInfo = await db.lead.update({
    where: { id: data.id },
    data: {
      ...data,
    },
  });
  if (!leadInfo) throw new Error("Something went wrong!");

  await createLeadActivity({
    leadId: leadInfo.id,
    type: LeadActivityType.GENERAL,
    activity: "General info updated",
    userId: user.id,
  });

  return leadInfo as LeadGeneralSchemaType;
};

export const updateLeadTitan = async ({
  id,
  titan,
}: {
  id: string;
  titan: boolean;
}) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  const existingLead = await db.lead.findUnique({ where: { id } });

  if (!existingLead) throw new Error("Lead does not exist!");

  if (existingLead.userId !== user.id) throw new Error("Unauthorized!");

  await db.lead.update({ where: { id }, data: { titan } });

  return {
    success: `Titan chat has been turned ${titan ? "on" : "off"} `,
    data: id,
  };
};

//LEAD ASSISTANT SHARE AND TRANSFER
export const addLeadAssistant = async ({
  id,
  assistantId,
}: {
  id: string;
  assistantId: string;
}) => {
  const user = await currentUser();

  if (!user) throw new Error("Unauthenticated!");
  const lead = await db.lead.findUnique({ where: { id, userId: user.id } });

  if (!lead) throw new Error("Lead does not exists!");

  const afUser = await db.user.findUnique({
    where: { id: assistantId },
  });

  if (!afUser) throw new Error("User does not exists!");

  await db.lead.update({
    where: { id },
    data: {
      assistantId,
    },
  });

  //Agent Notification
  await createNotification({
    reference: NotificationReference.NEW_ASSSISTANT,
    title: "New assistant",
    content: `You gave ${afUser.firstName} access to  ${lead.firstName}'s information`,
    link: `/leads/${lead.id}`,
    linkText: "View lead",
    userId: user.id,
    read: true,
  });

  //Assistant Notification
  await createNotification({
    reference: NotificationReference.NEW_ASSSISTANT,
    title: "New assistant",
    content: `${user.name} gave you acces to ${lead.firstName}'s information`,
    link: `/leads/${lead.id}`,
    linkText: "View lead",
    userId: afUser.id,
    read: false,
  });

  return {
    success: lead.firstName,
    message: `${afUser.firstName} now has access to  ${lead.firstName}'s information !`,
  };
};
export const removeLeadAssistant = async (id: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  const lead = await db.lead.findUnique({ where: { id, userId: user.id } });
  if (!lead) throw new Error("Lead does not exists!");

  const afUser = await db.user.findUnique({
    where: { id: lead.assistantId as string },
  });

  if (!afUser) throw new Error("User does not exists!");

  await db.lead.update({
    where: { id },
    data: {
      assistant: { disconnect: true },
    },
  });
  //Agent Notification
  await createNotification({
    reference: NotificationReference.UNSHARED_LEAD,
    title: "Unshared lead",
    content: `You removed ${afUser.firstName} access to ${lead.firstName}'s information`,
    link: `/leads/${lead.id}`,
    linkText: "View Lead",
    userId: user.id,
    read: true,
  });

  return {
    success: lead.firstName,
    message: `${afUser.firstName} access to  ${lead.firstName}'s information has been revoked!`,
  };
};

export const shareLead = async ({
  ids,
  userId,
}: {
  ids: string[];
  userId: string;
}) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  const sharedUser = await db.user.findUnique({ where: { id: userId } });
  if (!sharedUser) throw new Error("User does not exists!");

  for (let id of ids) {
    const lead = await db.lead.findUnique({ where: { id, userId: user.id } });
    if (!lead) throw new Error("Lead does not exists!");

    await db.lead.update({
      where: { id },
      data: {
        sharedUserId: sharedUser.id,
      },
    });
  }

  const lead = await db.lead.findUnique({ where: { id: ids[0] } });
  if (ids.length == 1) {
    //Agent Notification
    await createNotification({
      reference: NotificationReference.SHARED_LEAD,
      title: "Shared lead",
      content: `You shared a lead: ${lead?.firstName} with ${sharedUser?.firstName}`,
      link: `/leads/${lead?.id}`,
      linkText: "View lead",
      userId: user.id,
      read: true,
    });

    //Shared Agent Notification
    await createNotification({
      reference: NotificationReference.SHARED_LEAD,
      title: "Shared lead",
      content: `${user.name} shared a lead: ${lead?.firstName} with you`,
      link: `/leads/${lead?.id}`,
      linkText: "View lead",
      userId: sharedUser?.id as string,
      read: false,
    });
  } else {
    //Agent Notification
    await createNotification({
      reference: NotificationReference.SHARED_LEAD,
      title: "Shared lead",
      content: `You shared multiple leads with ${sharedUser?.firstName}`,
      link: JSON.stringify(ids),
      linkText: "View Leads",
      userId: user.id,
      read: true,
    });

    //Shared Agent Notification
    await createNotification({
      reference: NotificationReference.SHARED_LEAD,
      title: "Shared lead",
      content: `${user.name} transfered multiple leads to you`,
      link: JSON.stringify(ids),
      linkText: "View Leads",
      userId: sharedUser?.id as string,
      read: false,
    });
  }

  return {
    success: lead?.firstName,
    message: `Lead is now shared with ${sharedUser.firstName}!`,
  };
};

export const unshareLead = async (id: string) => {
  const user = await currentUser();

  if (!user) throw new Error("Unauthenticated!");

  const lead = await db.lead.findUnique({ where: { id, userId: user.id } });
  if (!lead) throw new Error("Lead does not exists!");

  const sharedUser = await db.user.findUnique({
    where: { id: lead.sharedUserId as string },
  });

  const unsharedLead = await db.lead.update({
    where: { id },
    data: {
      sharedUser: { disconnect: true },
    },
  });

  //Agent Notification
  await createNotification({
    reference: NotificationReference.UNSHARED_LEAD,
    title: "Unshared lead",
    content: `You unshared a lead: ${lead.firstName} with ${sharedUser?.firstName}`,
    link: undefined,
    linkText: undefined,
    userId: user.id,
    read: true,
  });

  //Shared Agent Notification
  await createNotification({
    reference: NotificationReference.UNSHARED_LEAD,
    title: "Unshared lead",
    content: `${user.name} unshared a lead: ${lead.firstName} with you`,
    link: undefined,
    linkText: undefined,
    userId: sharedUser?.id as string,
    read: false,
  });

  return {
    success: unsharedLead.firstName,
    message: "Lead sharing has been deactivated!",
  };
};

export const transferLead = async ({
  ids,
  userId,
}: {
  ids: string[];
  userId: string;
}) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  const tfUser = await db.user.findUnique({
    where: { id: userId },
    include: { phoneNumbers: true },
  });

  if (!tfUser) throw new Error("User does not exists!");

  for (let id of ids) {
    const lead = await db.lead.findUnique({ where: { id, userId: user.id } });
    if (!lead) throw new Error("Lead does not exists!");

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

    //Update all the upcoming appointments with this lead an agent
    await db.appointment.updateMany({
      where: {
        leadId: id,
        agentId: user.id,
        status: AppointmentStatus.SCHEDULED,
      },
      data: {
        status: AppointmentStatus.CANCELLED,
        reason: "Appointment has been canclled due to the lead transfer",
      },
    });
  }
  const lead = await db.lead.findUnique({ where: { id: ids[0] } });
  if (ids.length == 1) {
    //Agent Notification
    await createNotification({
      reference: NotificationReference.TRANSFERED_LEAD,
      title: "Transfered lead",
      content: `You transfered ${lead?.firstName}'s information to ${tfUser.firstName}`,
      link: undefined,
      linkText: undefined,
      userId: user.id,
      read: true,
    });

    //Transfered Agent Notification
    await createNotification({
      reference: NotificationReference.TRANSFERED_LEAD,
      title: "Transfered lead",
      content: `${user.name} transfered ${lead?.firstName}'s information to you`,
      link: `/leads/${lead?.id}`,
      linkText: "View Lead",
      userId: tfUser.id,
      read: false,
    });
  } else {
    //Agent Notification
    await createNotification({
      reference: NotificationReference.TRANSFERED_LEAD,
      title: "Transfered lead",
      content: `You transfered multiple leads to ${tfUser.firstName}`,
      link: undefined,
      linkText: undefined,
      userId: user.id,
      read: true,
    });

    //Transfered Agent Notification
    await createNotification({
      reference: NotificationReference.TRANSFERED_LEAD,
      title: "Transfered lead",
      content: `${user.name} transfered multiple leads to you`,
      link: JSON.stringify(ids),
      linkText: "View Leads",
      userId: tfUser.id,
      read: false,
    });
  }

  return {
    success: lead?.firstName,
    message: `Lead${ids.length > 1 ? "s are" : " is"} now transfered to ${
      tfUser.firstName
    }!`,
  };
};

//HELPER FUNCTIONS
export const getOrCreateLead = async (
  values: LeadSchemaType,
  agentId: string
) => {
  //Validate the data passed in
  const { success, data } = LeadSchema.safeParse(values);
  //If the validation failed return an error and exit the function
  if (!success) throw new Error("Invalid fields!");

  //Destucture the data for easy manipulation
  const {
    id,
    firstName,
    lastName,
    state,
    cellPhone,
    gender,
    maritalStatus,
    email,
    dateOfBirth,
  } = data;

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
      address: "N/A",
      city: "N/A",
      zipCode: "N/A",
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
//GENERIC ACTIONS

export const createLeadRelationship = async (
  leadOneId: string,
  leadTwoId: string,
  relationship: string
) => {
  await db.leadsOnLeads.create({
    data: {
      leadOneId,
      leadTwoId,
      relationship,
    },
  });
};

//HELPER FUNCTIONS
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
