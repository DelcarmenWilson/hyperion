import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { SettingsForm } from "./components/settings-form"

interface SettingsPageProps{
    params:{
        organizationId:string
    }
}
const SettingsPage = async({params}:SettingsPageProps) => {
    const user=await currentUser()

    if(!user){
        redirect('/auth/login')
    }

    const organization=await db.organization.findFirst({
        where:{
            id:params.organizationId,
            userId:user.id
        }
    })

    if(!organization){
        redirect("/")
    }

  return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <SettingsForm initialData={organization}/>
        </div>
    </div>
  )
}

export default SettingsPage