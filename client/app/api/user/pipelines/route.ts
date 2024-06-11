import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { pipelineGetAllByAgentId } from "@/actions/pipeline";

export async function GET(request: Request) {
    const user = await currentUser();
    if (!user) {
      redirect("/login");
    }  
      
    const pipelines = await pipelineGetAllByAgentId();
  
    return Response.json(pipelines);
  }
  