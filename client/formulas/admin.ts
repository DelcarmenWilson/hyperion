import { MedicalCondition } from "@prisma/client";
import { capitalize } from "./text";

import {
  CarrierConditionSchemaType,
  MedicalConditionSchemaType,
} from "@/schemas/admin";

export const convertCondition = (result: any): MedicalConditionSchemaType[] => {
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

export const convertCarrierCondition = (
  carrierId: string,
  conditions:MedicalCondition[] |undefined,
  result: any
): CarrierConditionSchemaType[] => {
  let mapped: CarrierConditionSchemaType[] = [];

  result.data.map((d: any) => {
    const newobj: CarrierConditionSchemaType = {
      carrierId: carrierId,
      // conditionId: conditions?.find(e=>e.name==d["Condition"])?.id || "N/A",
      conditionId: d["ConditionId"],
      requirements: d["Requirements".trimEnd()],
      notes: d["Notes".trimEnd()],
      condition: d["Condition".trimEnd()],
    };
    mapped.push(newobj);
  });
  return mapped;
};
