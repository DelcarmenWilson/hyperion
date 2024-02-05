import { formatObject } from "@/formulas/objects";
import { NextResponse } from "next/server";

export async function POST(req:Request){
const body=await req.formData()
const j:any=formatObject(body)
console.log(j)

    return new NextResponse("",{status:200})
}