import { capitalize } from "./text";

import {  MedicalConditionSchemaType } from "@/schemas/admin";

export const convertCondition = (
    result: any,
  ): MedicalConditionSchemaType[] => {
    let mapped: MedicalConditionSchemaType[] = [];    
  
    result.data.map((d: any) => {
      const newobj: MedicalConditionSchemaType = {
        name: capitalize(d["name"]),
        description: capitalize(d["description"]),
      };
      mapped.push(newobj);
    });
    return mapped;
  };