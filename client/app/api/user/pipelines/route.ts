import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getPipelines} from "@/actions/user/pipeline";

export async function GET(request: Request) {
    const user = await currentUser();
    if (!user) {
      redirect("/login");
    }  
      
    const pipelines = await getPipelines();
  
    return Response.json(pipelines);
  }
  