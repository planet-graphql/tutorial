import { dmmf, getPGBuilder, getPGPrismaConverter, PrismaTypes } from '@planet-graphql/core'

type TContext = {
  userId: number
  isAdmin: boolean
}

export const pg = getPGBuilder<{ Context: TContext, Prisma: PrismaTypes }>()
export const pgpc = getPGPrismaConverter(pg, dmmf)
export const { args } = pgpc.convertBuilders()
