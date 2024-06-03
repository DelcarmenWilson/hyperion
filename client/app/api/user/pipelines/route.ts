import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { pipelineGetAllByAgentId } from "@/data/pipeline";

export async function GET(request: Request) {
    const user = await currentUser();
    if (!user) {
      redirect("/login");
    }  
      
    const pipelines = await pipelineGetAllByAgentId(user.id);
  
    return Response.json(pipelines);
  }
  