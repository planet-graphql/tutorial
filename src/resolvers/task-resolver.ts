import { pg } from "../builder"
import { taskEnum } from '../models/task'
import { objects, prisma } from "../server"

export const tasksQuery = pg.query({
  name: 'tasks',
  field: (b) =>
    b
      .object(() => objects.Task)
      .relay()
      .relayOrderBy([{ updatedAt: 'desc' }, { id: 'desc' }])
      .relayArgs((f) => ({
        ...f,
        first: f.first.default(10).validation((schema) => schema.max(100)),
        last: f.last.default(10).validation((schema) => schema.max(100)),
      }))
      .relayTotalCount(({ context }) => prisma.task.count({
        where: { userId: context.userId },
      }))
      .resolve(({ context, prismaArgs }) => prisma.task.findMany({
        ...prismaArgs,
        where: { userId: context.userId },
      }))
})

const createTaskInput = pg.input({
  name: 'CreateTaskInput',
  fields: (b) => ({
    title: b.string().validation((schema) => schema.max(100)),
    content: b.string().nullable(),
    status: b.enum(taskEnum),
    dueAt: b.dateTime(),
  })
}).validation((value) => value.title.length > 0 || value.status !== 'new')

export const createTaskMutation = pg.mutation({
  name: 'createTask',
  field: (b) =>
    b
      .object(() => objects.Task)
      .args((b) => ({
        input: b.input(() => createTaskInput)
      }))
      .resolve(({ context, args }) => prisma.task.create({
        data: {
          ...args.input,
          userId: context.userId
        }
      }))
})

const updateTaskInput = createTaskInput.copy({
  name: 'UpdateTaskInput',
  fields: (f, b) => ({
    ...f,
    id: b.int(),
  })
})

export const updateTaskMutation = pg.mutation({
  name: 'updateTask',
  field: (b) =>
    b
      .object(() => objects.Task)
      .args((b) => ({
        input: b.input(() => updateTaskInput)
      })) 
      .resolve(async ({ context, args}) => {
        await prisma.task.findFirstOrThrow({
          where: {
            id: args.input.id,
            userId: context.userId,
          }
        })
        return prisma.task.update({
          where: {
            id: args.input.id,
          },
          data: args.input
        })
      })
})
