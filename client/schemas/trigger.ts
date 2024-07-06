import * as z from "zod";
const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];
const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
);



export const TriggerDataSchema = z.object({
   icon: z.string(), name: z.string(), text: z.string() 
});
export type TriggerDataSchemaType = z.infer<typeof TriggerDataSchema>;

export const TriggerSchema = z.object({
  id: z.optional(z.string()),
  name: z.string(),
  // data: z
  //   .object({}),
    data: TriggerDataSchema,
  type: z.string(),
  createdAt:z.date(),
  updatedAt:z.date(),
});
export type TriggerSchemaType = z.infer<typeof TriggerSchema>;