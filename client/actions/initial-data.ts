"use server";

import { db } from "@/lib/db";
import { DisasterType } from "@/app/(admin)/admin/import/components/disaster/columns";
import {
  Appointment,
  Call,
  ChatSettings,
  Lead,
  LeadConversation,
  LeadMessage,
  PhoneNumber,
  Presets,
  Schedule,
  User,
} from "@prisma/client";

export const initialUsers = async (values: User[]) => {
  const users = await db.user.createMany({
    data: values,
    skipDuplicates: true,
  });
  return {
    success: `${users.count} users out of ${values.length} have been imported`,
  };
};

export const initialChatSettings = async (values: ChatSettings[]) => {
  const chatsettings = await db.chatSettings.createMany({
    data: values,
    skipDuplicates: true,
  });
  return {
    success: `${chatsettings.count} chat settings out of ${values.length} have been imported`,
  };
};

export const initialPresets = async (values: Presets[]) => {
  const presets = await db.presets.createMany({
    data: values,
    skipDuplicates: true,
  });
  return {
    success: `${presets.count} presets out of ${values.length} have been imported`,
  };
};

export const initialSchedules = async (values: Schedule[]) => {
  const schedule = await db.schedule.createMany({
    data: values,
    skipDuplicates: true,
  });
  return {
    success: `${schedule.count} schedules out of ${values.length} have been imported`,
  };
};

export const initialLeads = async (values: Lead[]) => {
  const leads = await db.lead.createMany({
    data: values,
    skipDuplicates: true,
  });
  return {
    success: `${leads.count} leads out of ${values.length} have been imported`,
  };
};

export const initialCalls = async (values: Call[]) => {
  const calls = await db.call.createMany({
    data: values,
    skipDuplicates: true,
  });
  return {
    success: `${calls.count} calls out of ${values.length} have been imported`,
  };
};

export const initialAppointments = async (values: Appointment[]) => {
  const appointments = await db.appointment.createMany({
    data: values,
    skipDuplicates: true,
  });
  return {
    success: `${appointments.count} appointments out of ${values.length} have been imported`,
  };
};

export const initialConversations = async (values: LeadConversation[]) => {
  const conversations = await db.leadConversation.createMany({
    data: values,
    skipDuplicates: true,
  });
  return {
    success: `${conversations.count} conversations out of ${values.length} have been imported`,
  };
};

export const initialMessages = async (values: LeadMessage[]) => {
  const messages = await db.leadMessage.createMany({
    data: values,
    skipDuplicates: true,
  });
  return {
    success: `${messages.count} messages out of ${values.length} have been imported`,
  };
};

export const initialPhoneNumbers = async (values: PhoneNumber[]) => {
  const phoneNumber = await db.phoneNumber.createMany({
    data: values,
    skipDuplicates: true,
  });
  return {
    success: `${phoneNumber.count} phone numbers out of ${values.length} have been imported`,
  };
};

//TODO - dont forget to remove this after the fix
// DISISTER
export const initialDisasterMessages = async (values: DisasterType[]) => {
  let insertedMessages = 0;
  let createdConvos = 0;
  let passedMessages = 0;  

  await Promise.all(
    values.map(async (message) => {
      passedMessages++;
      const {
        agentId,
        leadId,
        createdAt,
        content,
        senderId,
        sid,
        role,
        price,
        status,
        error,
        hasSeen,
      } = message;
      const lead = await db.lead.findUnique({ where: { id: leadId } });

      if (!lead) {
        return message;
      }
      
      const agent = await db.user.findUnique({ where: { id: agentId } });
      if (!agent) 
        return message;
      
      let conversation = await db.leadConversation.findUnique({
        where: {
          leadId_agentId: {
            leadId:lead.id,
            agentId:agent.id,
          },
        },
      });
      
     
      if (!conversation) {
        conversation = await db.leadConversation.create({
          data: {
            leadId:lead.id,
            agentId:agent.id,
            createdAt,
            updatedAt: createdAt,
          },
        });
        createdConvos++;
      }
      if (!conversation) {
        return message;
      }
      const newMessage = await db.leadMessage.create({
        data: {
          conversationId: conversation.id,
          content,
          createdAt,
          senderId,
          role,
          price,
          status,
          error,
          hasSeen,
          sid,
        },
      });

      if (newMessage) {
        insertedMessages++;
        await db.leadConversation.update({
          where: { id: newMessage.conversationId },
          data: {
            lastMessageId: newMessage.id,
            updatedAt: newMessage.createdAt,
          },
        });
      }
      return newMessage
    })
  );

  // for (const message of values) {
  //   passedMessages++;
  //   const {
  //     agentId,
  //     leadId,
  //     createdAt,
  //     content,
  //     senderId,
  //     sid,
  //     role,
  //     price,
  //     status,
  //     error,
  //     hasSeen,
  //   } = message;
  //   const lead = await db.lead.findUnique({ where: { id: leadId } });
  //   if (lead) {
  //     let conversation = await db.leadConversation.findFirst({
  //       where: { agentId, leadId },
  //     });
  //     if (!conversation) {
  //       conversation = await db.leadConversation.create({
  //         data: {
  //           leadId,
  //           agentId,
  //           createdAt,
  //           updatedAt: createdAt,
  //         },
  //       });
  //       createdConvos++;
  //     }
  //     if (conversation) {
  //       const newMessage = await db.leadMessage.create({
  //         data: {
  //           //@ts-ignore
  //           conversationId: conversation.id,
  //           content,
  //           createdAt,
  //           senderId,
  //           role,
  //           price,
  //           status,
  //           error,
  //           hasSeen,
  //           sid,
  //         },
  //       });

  //       if (newMessage) {
  //         insertedMessages++;
  //         await db.leadConversation.update({
  //           where: { id: newMessage.conversationId },
  //           data: {
  //             lastMessageId: newMessage.id,
  //             updatedAt: newMessage.createdAt,
  //           },
  //         });
  //       }
  //     }
  //   }
  // }
  return {
    success: `${insertedMessages} messages out of ${values.length} have been imported. ${createdConvos} conversatioin created. ${passedMessages} passed messages.`,
  };
};
