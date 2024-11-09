import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server"

export async function POST(req:Request){
    
    try {
        const user= await currentUser()
        const body=await req.json()
        const {name}=body;
        
        if(!user?.id)
            return new NextResponse("Unauthenticated",{status:401})

        if(!name)
            return new NextResponse("Name is required",{status:400})        

         const organization=await db.organization.create({data:{
            name,userId:user.id
         }})

        return NextResponse.json(organization)
    } catch (error) {
        console.log("ORGANIZATIONS_POST",error)
        return new NextResponse("Internal Error",{status:500})
    }
}