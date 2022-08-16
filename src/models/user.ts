import { pgpc } from "../builder";
import { getRelations } from "../server";

export const user = pgpc.redefine({
  name: 'User',
  fields: (f, b) => ({
    ...f,
    taskCount: b.int()
  }),
  relations: () => getRelations('User'),
})
