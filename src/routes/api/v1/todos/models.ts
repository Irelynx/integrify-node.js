import z from 'zod';

export const TodoStatus = ['NotStarted', 'OnGoing', 'Completed'] as const;

export const NewTodoBody = z.object({
  id: z.never().optional(),
  name: z.string(),
  description: z.string().optional(),
  userId: z.never().optional(),
  createdAt: z.never().optional(),
  updatedAt: z.never().optional(),
  status: z.enum(TodoStatus).default('NotStarted'),
});
export type NewTodoBody = z.infer<typeof NewTodoBody>;

export const TodoQuery = z.object({
  status: z.enum(TodoStatus).optional(),
});
export type TodoQuery = z.infer<typeof TodoQuery>;

export const TodoParams = z.object({
  id: z.string().cuid(),
});
export type TodoParams = z.infer<typeof TodoParams>;
