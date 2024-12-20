import {
  Appointment,
  ChatSettings,
  Lead,
  LeadCommunication,
  LeadConversation,
  PhoneNumber,
  Presets,
  Schedule,
  User,
} from "@prisma/client";
import { capitalize } from "./text";
import { reFormatPhoneNumber } from "./phones";
//TODO - i believe this code plus the associated page can be removed. including the db calls
export const convertUsers = (result: any): User[] => {
  let mapped: User[] = [];
  result.data.map((d: any) => {
    const newobj: User = {
      id: d["id"],
      userName: d["userName"],
      firstName: capitalize(d["firstName"]),
      lastName: capitalize(d["lastName"]),
      phoneNumber: reFormatPhoneNumber(d["phoneNumber"]),
      npn: d["npn"],
      email: d["email"].toLowerCase(),
      emailVerified: null,
      image: d["image"],
      aboutMe: d["aboutMe"],
      title: d["title"],
      password: d["password"],
      role: d["role"],
      isTwoFactorEnabled: d["isTwoFactorEnabled"] == "f" ? false : true,
      teamId: d["teamId"],
      assitantId: d["assitantId"],
      adAccount: d["adAccount"],
      accountStatus: d["accountStatus"],
      createdAt: new Date(d["createdAt"]),
      updatedAt: new Date(d["updatedAt"]),
    };
    mapped.push(newobj);
  });
  return mapped;
};

export const convertChatSettings = (result: any): ChatSettings[] => {
  let mapped: ChatSettings[] = [];
  result.data.map((d: any) => {
    const newobj: ChatSettings = {
      userId: d["userId"],
      defaultPrompt: d["defaultPrompt"],
      defaultFunction: d["defaultFunction"],
      titan: d["titan"] == "f" ? false : true,
      coach: d["coach"] == "f" ? false : true,
      online: d["online"] == "f" ? false : true,
      createdAt: new Date(d["createdAt"]),
      updatedAt: new Date(d["updatedAt"]),
    };
    mapped.push(newobj);
  });
  return mapped;
};

export const convertPresets = (result: any): Presets[] => {
  let mapped: Presets[] = [];
  result.data.map((d: any) => {
    const newobj: Presets = {
      id: d["id"],
      agentId: d["agentId"],
      type: d["type"],
      content: d["content"],
      createdAt: new Date(d["createdAt"]),
      updatedAt: new Date(d["updatedAt"]),
    };
    mapped.push(newobj);
  });
  return mapped;
};

export const convertSchedules = (result: any): Schedule[] => {
  let mapped: Schedule[] = [];
  result.data.map((d: any) => {
    const newobj: Schedule = {
      userId: d["userId"],
      title: d["title"],
      subTitle: d["subTitle"],
      type: d["type"],
      sunday: d["sunday"],
      monday: d["monday"],
      tuesday: d["tuesday"],
      wednesday: d["wednesday"],
      thursday: d["thursday"],
      friday: d["friday"],
      saturday: d["saturday"],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mapped.push(newobj);
  });
  return mapped;
};

export const convertLeads = (result: any): Lead[] => {
  let mapped: Lead[] = [];
  result.data.map((d: any) => {
    const newobj: Lead = {
      id: d["id"],
      adId: d["adId"],
      firstName: d["firstName"],
      lastName: d["lastName"],
      address: d["address"],
      city: d["city"],
      state: d["state"],
      zipCode: d["zipCode"],
      homePhone: reFormatPhoneNumber(d["homePhone"]),
      cellPhone: reFormatPhoneNumber(d["cellPhone"]),
      gender: d["gender"],
      maritalStatus: d["maritalStatus"],
      email: d["email"],
      ssn: d["ssn"],
      //   dateOfBirth: d["dateOfBirth"],
      dateOfBirth: null,
      defaultNumber: reFormatPhoneNumber(d["defaultNumber"]),
      notes: d["notes"],
      userId: d["userId"],
      createdAt: new Date(d["createdAt"]),
      updatedBy: d["updatedBy"],
      updatedAt: new Date(d["updatedAt"]),
      currentInsuranse: d["currentInsuranse"],
      currentlyInsured: d["currentlyInsured"] == "f" ? false : true,
      height: d["height"],
      income: d["income"],
      policyAmount: d["policyAmount"],
      quote: d["quote"],
      recievedAt: new Date(d["recievedAt"]),
      smoker: d["smoker"] == "f" ? false : true,
      type: d["type"],
      vendor: d["vendor"],
      weight: d["weight"],
      statusId: d["statusId"],
      assistantId: d["assistantId"],
      sharedUserId: d["sharedUserId"],
      // intake form stuff
      weightLastYear: d["weightLastYear"],
      yearsSmoking: d["yearsSmoking"],
      placeOfBirth: d["placeOfBirth"],
      stateOfBirth: d["stateOfBirth"],
      licenseState: d["licenseState"],
      licenseNumber: d["licenseNumber"],
      licenseExpires: d["licenseExpires"],
      annualIncome: d["annualIncome"],
      experience: d["experience"],
      netWorth: d["netWorth"],
      employer: d["employer"],
      employerAddress: d["employerAddress"],
      employerPhone: d["employerPhone"],
      occupation: d["occupation"],
      greenCardNum: d["greenCardNum"],
      citizenShip: d["citizenShip"],
      yearsInUs: d["yearsInUs"],
      parentLiving: d["parentLiving"],
      fatherAge: d["fatherAge"],
      motherAge: d["motherAge"],
      cuaseOfDeath: d["cuaseOfDeath"],

      foreignVisited: d["foreignVisited"],
      textCode: d["textCode"],
      titan: d["titan"],
    };
    mapped.push(newobj);
  });
  return mapped;
};

export const convertCalls = (result: any): LeadCommunication[] => {
  let mapped: LeadCommunication[] = [];
  result.data.map((d: any) => {
    const newobj: LeadCommunication = {
      id: d["id"],
      status: d["status"],
      createdAt: new Date(d["createdAt"]),
      updatedAt: new Date(d["updatedAt"]),
      from: d["from"],
      type: d["type"],
      recordId: d["recordId"],
      recordStartTime: d["recordStartTime"]
        ? new Date(d["recordStartTime"])
        : null,
      recordStatus: d["recordStatus"],
      recordUrl: d["recordUrl"],
      direction: d["direction"],
      duration: d["duration"] ? parseInt(d["duration"]) : null,
      recordDuration: d["recordDuration"]
        ? parseInt(d["recordDuration"])
        : null,
      transcriptionId: d["transcriptionId"],
      transcriptionText: d["transcriptionText"],
      transcriptionUrl: d["transcriptionUrl"],
      listened: d["listened"] == "f" ? false : true,
      price: d["price"],
      recordPrice: d["recordPrice"],
      shared: false,
      appointmentId: d["appointmentId"],
      answeredBy: d["answeredBy"],
      machineDetectionDuration: d["machineDetectionDuration"],
      role: d["role"],
      content: d["content"],
      conversationId: d["conversationId"],
      attachment: d["attachment"],
      error: d["error"],
      hasSeen: d["hasSeen"],
    };
    mapped.push(newobj);
  });
  return mapped;
};

export const convertAppointments = (result: any): Appointment[] => {
  let mapped: Appointment[] = [];
  result.data.map((d: any) => {
    const newobj: Appointment = {
      id: d["id"],
      localDate: new Date(d["localDate"]),
      startDate: new Date(d["startDate"]),
      endDate: new Date(d["startDate"]),
      title: d["title"],
      calendar: d["calendar"],
      labelId: d["labelId"],
      agentId: d["agentId"],
      leadId: d["leadId"],
      status: d["status"],
      comments: d["comments"],
      reason: d["reason"],
      createdAt: new Date(d["createdAt"]),
      updatedAt: new Date(d["updatedAt"]),
    };
    mapped.push(newobj);
  });
  return mapped;
};

export const convertConversations = (result: any): LeadConversation[] => {
  let mapped: LeadConversation[] = [];
  result.data.map((d: any) => {
    const newobj: LeadConversation = {
      id: d["id"],
      leadId: d["leadId"],
      agentId: d["agentId"],
      createdAt: new Date(d["createdAt"]),
      updatedAt: new Date(d["updatedAt"]),
      lastCommunicationId: d["lastCommunicationId"],
      unread: d["lastMessageId"],
    };
    mapped.push(newobj);
  });
  return mapped;
};

export const convertMessages = (result: any): LeadCommunication[] => {
  let mapped: LeadCommunication[] = [];
  result.data.map((d: any) => {
    const newobj: LeadCommunication = {
      id: d["id"],
      conversationId: d["conversationId"],
      role: d["role"],
      attachment: d["attachment"],
      content: d["content"],
      createdAt: new Date(d["createdAt"]),
      hasSeen: d["hasSeen"] == "f" ? false : true,
      error: d["error"],
      price: d["price"],
      from: d["from"],
      status: d["status"],
      type: d["type"],
      direction: d["direction"],
      listened: d["listened"],
      shared: d["shared"],
      answeredBy: d["answeredBy"],
      machineDetectionDuration: d["machineDetectionDuration"],
      updatedAt: d["updatedAt"],
      duration: d["duration"],
      recordId: d["recordId"],
      recordUrl: d["recordUrl"],
      recordStartTime: d["recordStartTime"],
      recordStatus: d["recordStatus"],
      recordDuration: d["recordDuration"],
      recordPrice: d["recordPrice"],
      transcriptionId: d["transcriptionId"],
      transcriptionUrl: d["transcriptionUrl"],
      transcriptionText: d["transcriptionText"],
      appointmentId: d["appointmentId"],
    };
    mapped.push(newobj);
  });
  return mapped;
};

export const convertPhoneNumbers = (result: any): PhoneNumber[] => {
  let mapped: PhoneNumber[] = [];
  result.data.map((d: any) => {
    const newobj: PhoneNumber = {
      id: d["id"],
      phone: d["phone"],
      state: d["state"],
      agentId: d["agentId"],
      sid: d["sid"],
      app: d["app"],
      status: d["status"],
      registered: d["registered"],
      renewAt: new Date(d["renewAt"]),
      createdAt: new Date(d["createdAt"]),
      updatedAt: new Date(d["updatedAt"]),
    };
    mapped.push(newobj);
  });
  return mapped;
};
