import { createServer } from '@graphql-yoga/node'
import { PrismaClient } from '@prisma/client'
import { args, pg, pgpc } from './builder'
import { task } from './models/task'
import { user } from './models/user'
import { createTaskMutation, tasksQuery, updateTaskMutation } from './resolvers/task-resolver'
import { usersQuery } from './resolvers/user-resolver'

export const prisma = new PrismaClient({ log: ['query'] })

export const { objects, getRelations } = pgpc.convertTypes({
  User: () => user,
  Task: () => task,
})

const server = createServer({
  schema: pg.build([usersQuery, tasksQuery, createTaskMutation, updateTaskMutation]),
  maskedErrors: false,
  context: ({ req }) => ({
    userId: Number(req.headers['x-user-id'] ?? 0),
    isAdmin: Boolean(req.headers['x-is-admin'] ?? false),
  })
})

server.start()
