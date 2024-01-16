import { db } from "@/lib/db";
import { ChatClient } from "./components/client";
import { MessageColumn } from "./components/columns";
import { format } from "date-fns";

const ChatPage = async() => {
  
  const messages=await db.message.findMany({where:{
  },orderBy:{
    createdAt:"desc"
  }})

  const formattedTeams:MessageColumn[]=messages.map((message)=>({
    id:message.id,
    role:message.role,
    content:message.content,
    createdAt:format(message.createdAt,"MMMM do, yyyy")
    }))
  return (
    <>
    
  
     
     
     <ChatClient data={formattedTeams}/>

    </>
  );
};

export default ChatPage;
