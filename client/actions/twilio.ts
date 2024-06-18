
import { currentUser } from "@/lib/auth";
import { tokenGenerator } from "@/lib/twilio/handler";
export const getTwilioToken = async () => {
      try {
        const user=await currentUser()
        if(!user){
          return null
        }

      const token = tokenGenerator(user.id)
      return token.token;
    } catch {
      return null;
    }
  };