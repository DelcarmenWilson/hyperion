

import { funnelsGetAll } from "@/actions/funnel";
import { Prisma } from "@prisma/client";

export type FunnelsForSubAccount = Prisma.PromiseReturnType<
  typeof funnelsGetAll
>[0]

export type FunnelPageUpsertType = Prisma.FunnelPageCreateWithoutFunnelInput
