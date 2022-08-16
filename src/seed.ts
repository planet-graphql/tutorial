import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

async function clean() {
  await prisma.task.deleteMany()
  await prisma.user.deleteMany()
}

async function createUsersAndTasks(userCount = 100, taskCount = 10) {
  for (let userId of [...Array(userCount).keys()]) {
    const firstName = faker.name.firstName()
    await prisma.user.create({
      data: {
        id: userId,
        name: faker.name.fullName({ firstName }),
        email: faker.internet.email(firstName),
        tasks: {
          create: [...Array(taskCount).keys()].map((taskId) => ({
            id: userId * userCount + taskId,
            title: faker.lorem.sentence(),
            content: faker.lorem.paragraph(),
            status: faker.helpers.arrayElement(['new', 'in_progress', 'done']),
            dueAt: faker.date.future()
          }))
        }
      }
    })
  }
}

async function seed() {
  await clean()
  await createUsersAndTasks()
}

seed()