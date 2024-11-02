import { auth } from "@/auth";
import { ExtendedUser } from "@/next-auth";
import { UserRole } from "@prisma/client";

/**
 * Returns the current user
 * @type {ExtendedUser}
 */
export const currentUser = async () => {
  const session = await auth();
  return session?.user;
};


/**
 * Returns the current user role
 * @type {UserRole}
 */
export const currentRole = async () => {
  const session = await auth();
  return session?.user?.role;
};