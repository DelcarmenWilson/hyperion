import { UserButton } from "@/components/auth/user-button";
import { MainNav } from "@/components/main-nav";
import { OrganizationSwitcher } from "@/components/organization-switcher";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { OrganizationNav } from "./organization-nav";

const SideBar = async () => {
    const user=await currentUser()
    if(!user){
        redirect("/auth/login")
    }
    const organizations =await  db.organization.findMany({where:{userId:user.id}})
  return (
    <div className="border-r p-4">
      <div className="flex flex-col w-[200px] items-center">
        <OrganizationSwitcher items={organizations}/>
            <OrganizationNav className="mx-6"/>
      </div>
    </div>
  );
};

export default SideBar;
