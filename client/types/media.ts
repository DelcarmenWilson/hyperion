import { mediaGetAll } from "@/actions/media"
import { Prisma } from "@prisma/client"

export type GetMediaFiles = Prisma.PromiseReturnType<typeof mediaGetAll>

export type CreateMediaType = Prisma.MediaCreateWithoutUserInput