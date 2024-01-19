import { db } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";

import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

import { MainNav } from "@/components/main-nav";
import { UserButton } from "@/components/auth/user-button";
import { ThemeToggle } from "./custom/theme-toggle";

const NavBar = async () => {
  const user = await currentUser();
  if (!user) {
    redirect("/auth/login");
  }
  const organizations = await db.organization.findMany({
    where: { userId: user.id },
  });
  return (
    <div className="border-b sticky w-full top-0 z-10">
      <div className="flex h-16 items-center px-4 overflow-hidden">
        <Link
          href="/"
          className="flex justify-between items-center hover:bg-accent px-2"
        >
          <Image
            src="/logo2.png"
            width="50"
            height="50"
            alt="logo"
            className="mr-1 h-[50px] w-[50px]"
          />
          <span>Hyperion</span>
        </Link>
        <div>
          <MainNav className="mx-6" />
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <UserButton />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
