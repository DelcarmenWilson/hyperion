import { db } from "@/lib/db";
import { tokenGenerator } from "@/lib/twilio/handler";

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
    });
    
    return verificationToken;
  } catch {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: { email },
    });

    return verificationToken;
  } catch {
    return null;
  }
};

export const getTwilioToken = async (userId: string) => {
  try {
    const token = tokenGenerator(userId)
    return token.token;
  } catch {
    return null;
  }
};