import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  const organization = await db.organization.findFirst();

  if (organization) {
    if (!user) {
      redirect("/login");
    } else {
      if (user.role == "MASTER") {
        redirect(`/admin`);
      } else {
        redirect(`/dashboard`);
      }
    }
  }

  return <>{children}</>;
}
