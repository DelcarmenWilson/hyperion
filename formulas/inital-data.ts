import {
  Appointment,
  Call,
  ChatSettings,
  Conversation,
  Lead,
  Message,
  PhoneNumber,
  Presets,
  Schedule,
  User,
} from "@prisma/client";
import { capitalize } from "./text";
import { reFormatPhoneNumber } from "./phones";

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
      password: d["password"],
      role: d["role"],
      isTwoFactorEnabled: d["isTwoFactorEnabled"] == "f" ? false : true,
      teamId: d["teamId"],
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
      leadInfo: d["leadInfo"] == "f" ? false : true,
      autoChat: d["autoChat"] == "f" ? false : true,
      record: d["record"] == "f" ? false : true,
      coach: d["coach"] == "f" ? false : true,
      createdAt: new Date(d["createdAt"]),
      updatedAt: new Date(d["updatedAt"]),
      currentCall: "",
      voicemailIn:"",
      voicemailOut:""
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
      createdAt:new Date(),
      updatedAt: new Date()
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
      //   dateOfBirth: d["dateOfBirth"],
      dateOfBirth: null,
      defaultNumber: reFormatPhoneNumber(d["defaultNumber"]),
      notes: d["notes"],
      userId: d["userId"],
      createdAt: new Date(d["createdAt"]),
      updatedBy: d["updatedBy"],
      updatedAt: new Date(d["updatedAt"]),
      commision: d["commision"] ,
      costOfLead: d["costOfLead"],
      currentInsuranse: d["currentInsuranse"],
      currentlyInsured: d["currentlyInsured"] == "f" ? false : true,
      height: d["height"],
      income: d["income"] ,
      policyAmount: d["policyAmount"],
      quote: d["quote"] ,
      recievedAt: new Date(d["recievedAt"]),
      saleAmount: d["saleAmount"],
      smoker: d["smoker"] == "f" ? false : true,
      type: d["type"],
      vendor: d["vendor"],
      weight: d["weight"] ,
      status: d["status"],
    };
    mapped.push(newobj);
  });
  return mapped;
};

export const convertCalls = (result: any): Call[] => {
  let mapped: Call[] = [];
  result.data.map((d: any) => {
    const newobj: Call = {
      id: d["id"],
      userId: d["userId"],
      leadId: d["leadId"] || null,
      status: d["status"],
      createdAt: new Date(d["createdAt"]),
      updatedAt: new Date(d["updatedAt"]),
      from: d["from"],
      type: d["type"],
      recordId: d["recordId"],
      recordStartTime: d["recordStartTime"]?new Date(d["recordStartTime"]):null,
      recordStatus: d["recordStatus"],
      recordUrl: d["recordUrl"],
      direction: d["direction"],
      duration: d["duration"] ? parseInt(d["duration"]) : null,
      recordDuration: d["recordDuration"]
        ? parseInt(d["recordDuration"])
        : null,
        transcriptionId:d["transcriptionId"],
        transcriptionText:d["transcriptionText"],
        transcriptionUrl:d["transcriptionUrl"],
        listened:d["listened"]=="f"?false:true,
      price: d["price"],
      recordPrice:d["recordPrice"],
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
      date: new Date(d["date"]),
      agentId: d["agentId"],
      leadId: d["leadId"],
      status: d["status"],
      comments: d["comments"],
      createdAt: new Date(d["createdAt"]),
      updatedAt: new Date(d["updatedAt"]),
    };
    mapped.push(newobj);
  });
  return mapped;
};

export const convertConversations = (result: any): Conversation[] => {
  let mapped: Conversation[] = [];
  result.data.map((d: any) => {
    const newobj: Conversation = {
      id: d["id"],
      leadId: d["leadId"],
      agentId: d["agentId"],
      createdAt: new Date(d["createdAt"]),
      updatedAt: new Date(d["updatedAt"]),
      autoChat: d["autoChat"] == "f" ? false : true,
      lastMessage: d["lastMessage"],
    };
    mapped.push(newobj);
  });
  return mapped;
};

export const convertMessages = (result: any): Message[] => {
  let mapped: Message[] = [];
  result.data.map((d: any) => {
    const newobj: Message = {
      id: d["id"],
      conversationId: d["conversationId"],
      role: d["role"],
      content: d["content"],
      senderId: d["senderId"],
      createdAt: new Date(d["createdAt"]),
      hasSeen: d["hasSeen"] == "f" ? false : true,
      error: d["error"],
      price: d["price"],
      sid: d["sid"],
      status: d["status"],
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
      status: d["status"],
      renewAt: new Date(d["renewAt"]),
      createdAt: new Date(d["createdAt"]),
      updatedAt: new Date(d["updatedAt"]),
    };
    mapped.push(newobj);
  });
  return mapped;
};
