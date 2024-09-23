import { LucideIcon } from "lucide-react";

interface INodeType {
description:INodeTypeBaseDescription;
type:string;
}
export interface INodeTypeBaseDescription {
  displayName: string;
  name: string;
  icon?: LucideIcon;
  iconColor?:string;
  iconUrl?:string
  group: string[];
  subtitle: string;
  description: string;
  defaultVersion: number;

}

// export interface INodeTypeDescription extends INodeTypeBaseDescription {
// 	version: number | number[];
// 	defaults: NodeDefaults;
// 	eventTriggerDescription?: string;
	
// 	inputs: Array<NodeConnectionType | INodeInputConfiguration> | ExpressionString;
// 	requiredInputs?: string | number[] | number; // Ony available with executionOrder => "v1"
// 	inputNames?: string[];
// 	outputs: Array<NodeConnectionType | INodeOutputConfiguration> | ExpressionString;
// 	outputNames?: string[];
// 	properties: INodeProperties[];
	
// 	maxNodes?: number; // How many nodes of that type can be created in a workflow
// 	polling?: true | undefined;
// 	supportsCORS?: true | undefined;
	
// 	hints?: NodeHint[];
	
// }


