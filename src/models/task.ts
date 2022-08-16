import { pg, pgpc } from "../builder"
import { getRelations } from "../server"

export const task = pgpc.redefine({
  name: 'Task',
  fields: (f) => {
    const { user, ...rest } = f
    return { ...rest }
  },
  relations: () => getRelations('Task'),
})

export const taskEnum = pg.enum({
  name: 'TaskEnum',
  values: ['new', 'in_progress', 'done']
})
