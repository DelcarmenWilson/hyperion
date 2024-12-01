import { NextResponse } from "next/server";
import { createNewBlueprintWeek } from "@/actions/blueprint/week/create-new-blueprint-week";
import { hideDeletedMessages } from "@/actions/chat/message/hide-deleted-messages";
import { remindTodos } from "@/actions/user/todo";
import { scheduleLeadsToImport } from "@/actions/facebook/leads";
import { setActiveQuote } from "@/actions/admin/quote/set-active-quote";
//TODO - need to change the name of this route and make sure to also update the server
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type } = body;
    switch (type) {
      case "createWeeklyBlueprint":
        await createNewBlueprintWeek();
        break;
      case "newQuote":
        await setActiveQuote();
        break;
        //TODO - need to change the name of this function call
      case "hideDeletedMessages":
        await hideDeletedMessages();
        break;
      case "todoReminder":
        await remindTodos();
        break;

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
