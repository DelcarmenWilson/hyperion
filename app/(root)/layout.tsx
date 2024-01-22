import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/login");
  }

  const organization = await db.organization.findFirst({
    where: { userId: user.id },
  });

  if (organization) {
    redirect(`/dashboard`);
  }

  return <>{children}</>;
}
