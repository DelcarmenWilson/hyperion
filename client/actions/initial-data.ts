"use server";

import { DisasterType } from "@/app/(admin)/admin/import/components/disaster/columns";
import { db } from "@/lib/db";
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

export const initialConversations = async (values: Conversation[]) => {
  const conversations = await db.conversation.createMany({
    data: values,
    skipDuplicates: true,
  });
  return {
    success: `${conversations.count} conversations out of ${values.length} have been imported`,
  };
};

export const initialMessages = async (values: Message[]) => {
  const messages = await db.message.createMany({
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
  //for (let i = 0; i < values.length; i++) {

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
  //     let conversation = await db.conversation.findFirst({
  //       where: { agentId, leadId },
  //     });
  //     if (!conversation) {
  //       conversation = await db.conversation.create({
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
  //       const newMessage = await db.message.create({
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
  //         await db.conversation.update({
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
      if (!agent) {
        return message;
      }
      let conversation = await db.conversation.findUnique({
        where: {
          leadId_agentId: {
            leadId:lead.id,
            agentId:agent.id,
          },
        },
      });
      
      console.log(conversation);
      if (!conversation) {
        console.log(lead.id,agent.id);
        conversation = await db.conversation.create({
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
      const newMessage = await db.message.create({
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
        await db.conversation.update({
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
  //     let conversation = await db.conversation.findFirst({
  //       where: { agentId, leadId },
  //     });
  //     if (!conversation) {
  //       conversation = await db.conversation.create({
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
  //       const newMessage = await db.message.create({
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
  //         await db.conversation.update({
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
