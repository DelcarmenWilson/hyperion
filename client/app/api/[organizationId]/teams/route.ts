import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server"

export async function POST(req:Request,{params}:{params:{organizationId:string}}){
    
    try {
        const user= await currentUser()
        const body=await req.json()
        const {name}=body;
        
        if(!user){
            return new NextResponse("Unathenticated",{status:401})
        }

        if(!name){
            return new NextResponse("Name is required",{status:400})
        }

        if(!params.organizationId){
            return new NextResponse("Organization id is required",{status:400})
        }
        const organizationByUserId=await db.organization.findFirst({where:{
            id:params.organizationId,
            userId:user.id
        }})

        if(!organizationByUserId){
            return new NextResponse("Unauthorized",{status:400})
        }
         const team=await db.team.create({
            data:{
                name,
                organizationId:params.organizationId,
                userId:user.id
            }
         })
        return NextResponse.json(team)
    } catch (error) {
        console.log("TEAMS_POST_ERROR",error)
        return new NextResponse("Internal Error",{status:500})
    }
}

export async function GET(req:Request,{params}:{params:{organizationId:string}}){
    
    try { 
         const teams=await db.team.findMany({
            where:{
                organizationId:params.organizationId
            }
         })
        return NextResponse.json(teams)
    } catch (error) {
        console.log("TEAMS_POST_ERROR",error)
        return new NextResponse("Internal Error",{status:500})
    }
}