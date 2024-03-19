import * as z from "zod";
import { capitalize } from "./text";

import {  MedicalConditionSchema } from "@/schemas";
type MedicalConditionFormValues = z.infer<typeof MedicalConditionSchema>;

export const convertCondition = (
    result: any,
  ): MedicalConditionFormValues[] => {
    let mapped: MedicalConditionFormValues[] = [];    
  
    result.data.map((d: any) => {
      const newobj: MedicalConditionFormValues = {
        name: capitalize(d["name"]),
        description: capitalize(d["description"]),
      };
      mapped.push(newobj);
    });
    return mapped;
  };