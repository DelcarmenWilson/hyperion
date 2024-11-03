import { NextResponse } from "next/server";
import { createWeeklyBlueprint } from "@/actions/blueprint/blueprint-week";
import { adminQuoteUpdateActive } from "@/actions/admin/quote";
import { scheduleLeadsToImport } from "@/actions/facebook/leads";
import { hideDeletedMessages } from "@/actions/chat/message";

//calculate blueprint targets
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type } = body;
    switch (type) {
      case "createWeeklyBlueprint":
        await createWeeklyBlueprint();
        break;
      case "newQuote":
        await adminQuoteUpdateActive();
        break;

        // case "hideDeletedMessages":
        //   await hideDeletedMessages();
        //   break;
   
//TODO - this has been turned off becuase there is no data flowing thur anymore and the server kept crashing
        // case "newLeads":
        // await scheduleLeadsToImport();
        //break;
    }

    return NextResponse.json({
      success: `${type} job has ran successfully`,
      status: 200,
    });
    // return NextResponse.json({ success: 'Job has ran successfully', status: 200 });
  } catch (error) {
    console.log("JOBS_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
