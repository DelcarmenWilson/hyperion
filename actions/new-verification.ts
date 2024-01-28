"use server";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { chatSettingsInsert } from "./chat-settings";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  //CHECK OF TOKEN ACTUALLY EXIST
  if (!existingToken) {
    return { error: "Token does not exist" };
  }

  //CHECK IF TOKEN HAS EXPIRED
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token has expired" };
  }

  //GET THE ECISITING USER
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  //UPDATE THE USER
  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

//CREATE CHAT SETTINGS
await chatSettingsInsert(existingUser)

//DELETE VERIFICATION TOKEN
await db.verificationToken.delete({
    where:{id:existingToken.id}
})

return {success:"Email verified"}

};
