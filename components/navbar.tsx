import { db } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";

import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

import { MainNav } from "@/components/main-nav";
import { UserButton } from "@/components/auth/user-button";

const NavBar = async () => {
    const user=await currentUser()
    if(!user){
        redirect("/auth/login")
    }
    const organizations =await  db.organization.findMany({where:{userId:user.id}})
  return (
    <div className="border-b sticky w-full top-0 bg-white z-10">
      <div className="flex h-16 items-center px-4 overflow-hidden">
      <Link href="/" className="flex justify-between items-center hover:bg-gray-200 px-2">
          <Image
            src="/logo2.png"
            width="100"
            height="100"
            alt="logo"
            className="mr-1 h-[60px] w-[60px]"
          />
          <span>Hyperion</span>
        </Link>
        <div>
            <MainNav className="mx-6"/>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <UserButton />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
