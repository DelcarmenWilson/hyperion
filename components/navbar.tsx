import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

import { MainNav } from "@/components/main-nav";
import { UserButton } from "@/components/auth/user-button";
import { ThemeToggle } from "./custom/theme-toggle";

const NavBar = async () => {
  const user = await currentUser();
  if (!user) {
    redirect("/login");
  }
  return (
    <div className=" flex items-center  sticky w-full top-0 z-10 py-2 px-4">
      <div>{/* <MainNav className="mx-6" /> */}</div>
      <div className="ml-auto flex items-center space-x-4">
        <ThemeToggle />
        <UserButton />
      </div>
    </div>
  );
};

export default NavBar;
