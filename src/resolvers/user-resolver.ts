import { args, pg } from "../builder"
import { user } from "../models/user"
import { objects, prisma } from "../server"

user.implement((f) => ({
  taskCount: f.taskCount.resolve((params) => {
    return pg.dataloader(params, async (userList) => {
      const userIds = userList.map((x) => x.id)
      const resp = await prisma.task.groupBy({
        by: ['userId'],
        _count: { _all: true },
        where: { userId: { in: userIds } },
      })
      return userIds.map((id) => resp.find((x) => x.userId === id)?._count._all ?? 0)
    })
  })
}))

export const usersQuery = pg.query({
  name: 'users',
  field: (b) =>
    b
      .object(() => objects.User)
      .list()
      .auth(({ context }) => context.isAdmin)
      .prismaArgs(() => args.findManyUser.build())
      .resolve(({ prismaArgs }) => prisma.user.findMany(prismaArgs))
})
