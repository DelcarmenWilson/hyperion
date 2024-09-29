import { Mail } from "lucide-react";
import { INodeTypeBaseDescription } from "./node_type";

export class EmailSend {
  constructor() {
    const baseDescription: INodeTypeBaseDescription = {
      displayName: "Send Email",
      name: "sendEmail",
      icon: Mail,
      group: ["email"],
      subtitle: "Send Email",
      description: "Send Email from Hyperion",
      defaultVersion: 1.0,
    };
  }
}
