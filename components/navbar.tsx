import { db } from "@/lib/db";

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
  return (
    <div className="sticky w-full top-0 z-10">
      <div className="flex h-16 items-center px-4 overflow-hidden">
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
