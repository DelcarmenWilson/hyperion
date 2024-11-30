import { z } from "zod";

export const CreateCategorySchema=z.object({
    name:z.string().min(3).max(30),
    color:z.string().max(20),
    description:z.string().optional()
})

export type CreateCategorySchemaType =z.infer<typeof CreateCategorySchema>

