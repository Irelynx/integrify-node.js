import { Forbidden } from '@/routes/httpErrors';
import { AsyncRequestHandler } from '@/routes/middlewares';
import { Todo } from '@prisma/client';
import { TodoQuery, NewTodoBody, TodoParams } from './models';
import db from '@/db';

export const getAll: AsyncRequestHandler<{}, Array<Todo>, never, TodoQuery> =
async function getAll(req, res) {
  const status = req.query.status;
  const user = req.user;
  if (!user) throw new Forbidden();
  
  const todos = await db.todo.findMany({
    where: {
      userId: user.id || '',
      status,
    }
  });

  res.json(todos);
};

export const createOne: AsyncRequestHandler<{}, Todo, NewTodoBody> =
async function createOne(req, res) {
  const user = req.user;
  const newTodo = req.body;
  if (!user) throw new Forbidden();

  const todo = await db.todo.create({
    data: {
      ...newTodo,
      userId: user.id,
    }
  });

  res.json(todo);
};

export const deleteOne: AsyncRequestHandler<TodoParams, Todo, never> =
async function deleteOne(req, res) {
  const user = req.user;
  const id = req.params.id;
  if (!user) throw new Forbidden();

  const todo = await db.todo.findUnique({
    where: {
      id,
    },
  });

  if (todo?.userId !== user.id) {
    throw new Forbidden();
  }

  const deleted = await db.todo.delete({
    where: {
      id
    },
  });

  res.json(deleted);
};

export const updateOne: AsyncRequestHandler<TodoParams, Todo, NewTodoBody> =
async function updateOne(req, res) {
  const user = req.user;
  const id = req.params.id;
  const updatedTodo = req.body;
  if (!user) throw new Forbidden();

  const todo = await db.todo.findUnique({
    where: {
      id,
    },
  });

  if (todo?.userId !== user.id) {
    throw new Forbidden();
  }

  const updated = await db.todo.update({
    where: {
      id,
    },
    data: {
      ...updatedTodo,
    }
  });

  res.json(updated);
};