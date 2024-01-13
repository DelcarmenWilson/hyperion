import { UserButton } from "@/components/auth/user-button";
import { MainNav } from "@/components/main-nav";
import { OrganizationSwitcher } from "@/components/organization-switcher";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const NavBar = async () => {
    const user=await currentUser()
    if(!user){
        redirect("/auth/login")
    }
    const organizations =await  db.organization.findMany({where:{userId:user.id}})
  return (
    <div className="border-b ">
      <div className="flex h-16 items-center px-4">
        <OrganizationSwitcher items={organizations}/>
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
