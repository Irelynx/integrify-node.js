import request from 'supertest';
import app from '@/app';
import { APIPrefix } from '..';
import { Todo, User } from '@prisma/client';
import db from '@/db';
import { mockedData } from '@/tests/mockData';
import { NewTodoBody } from './models';

const sharedData: {
  user: User;
  userAlt: User;
  token: string;
  tokenAlt: string;
  authorization: string;
  authorizationAlt: string;
  todo: Todo;
  todoCompleted: Todo;
  todoAlt: Todo;
} = {
  user: null as any,
  userAlt: null as any,
  token: '',
  tokenAlt: '',
  authorization: 'Bearer ',
  authorizationAlt: 'Bearer ',
  todo: null as any,
  todoCompleted: null as any,
  todoAlt: null as any,
};

const toRemove: Array<
  { type: 'user'; data: User } |
  { type: 'todo'; data: Todo }
> = [];

beforeAll(async () => {
  const user = await db.user.findUnique({
    where: {
      email: mockedData.email,
    },
  });
  if (!user) {
    throw new Error('Init failed! User does not exists in DB!');
  } else {
    sharedData.user = user;
  }

  const userAlt = await db.user.findUnique({
    where: {
      email: mockedData.emailAlt,
    },
  });
  if (!userAlt) {
    throw new Error('Init failed! Alternative User does not exists in DB!');
  } else {
    sharedData.userAlt = userAlt;
  }

  const resAuth = await request(app)
    .post(`${APIPrefix}/signin`)
    .set('Content-Type', 'application/json')
    .send({
      email: user.email,
      password: user.password,
    });
  if (!resAuth.body.token) {
    throw new Error('Init failed! Authorization failed!');
  } else {
    sharedData.token = resAuth.body.token;
    sharedData.authorization += sharedData.token;
  }
  
  const resAuthAlt = await request(app)
    .post(`${APIPrefix}/signin`)
    .set('Content-Type', 'application/json')
    .send({
      email: userAlt.email,
      password: userAlt.password,
    });
  if (!resAuthAlt.body.token) {
    throw new Error('Init failed! Authorization failed!');
  } else {
    sharedData.tokenAlt = resAuthAlt.body.token;
    sharedData.authorizationAlt += sharedData.tokenAlt;
  }

  const resTodo = await request(app)
    .post(`${APIPrefix}/todos`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', sharedData.authorization)
    .send({
      name: 'test before',
      description: 'hello world',
    } as NewTodoBody)
    .expect('Content-Type', /json/)
    .expect(200);
  sharedData.todo = resTodo.body as Todo;
  toRemove.push({ type: 'todo', data: resTodo.body });
  
  const resTodoCompleted = await request(app)
    .post(`${APIPrefix}/todos`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', sharedData.authorization)
    .send({
      name: 'test before',
      description: 'hello world',
      status: 'Completed',
    } as NewTodoBody)
    .expect('Content-Type', /json/)
    .expect(200);
  sharedData.todoCompleted = resTodoCompleted.body as Todo;
  toRemove.push({ type: 'todo', data: resTodoCompleted.body });

  const resTodoAlt = await request(app)
    .post(`${APIPrefix}/todos`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', sharedData.authorizationAlt)
    .send({
      name: 'test before alt',
      description: 'hello world',
    } as NewTodoBody)
    .expect('Content-Type', /json/)
    .expect(200);
  sharedData.todoAlt = resTodoAlt.body as Todo;
  toRemove.push({ type: 'todo', data: resTodoAlt.body });
});

afterAll(async () => {
  for (const object of toRemove) {
    if (object.type === 'user') {
      await db.user.delete({
        where: {
          id: object.data.id,
          email: object.data.email,
        },
      }).catch(e => e);
    } else if (object.type === 'todo') {
      await db.todo.delete({
        where: {
          id: object.data.id,
        },
      }).catch(e => e);
    }
  }
});

describe('POST /todos', () => {
  it('must accept new user todo (with just name)', async () => {
    const res = await request(app)
      .post(`${APIPrefix}/todos`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', sharedData.authorization)
      .send({
        name: 'test',
      } as NewTodoBody)
      .expect('Content-Type', /json/)
      .expect(200);
    const body = res.body as Todo;
    expect(body).toBeInstanceOf(Object);
    expect(body.name).toBe('test');
    expect(body.id).toBeTruthy();
    toRemove.push({ type: 'todo', data: body });
  });

  it('must accept new user todo (with name, description and status)', async () => {
    const res = await request(app)
      .post(`${APIPrefix}/todos`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', sharedData.authorization)
      .send({
        name: 'test2',
        description: 'hello world',
        status: 'Completed',
      } as NewTodoBody)
      .expect('Content-Type', /json/)
      .expect(200);
    const body = res.body as Todo;
    expect(body).toBeInstanceOf(Object);
    expect(body.name).toBe('test2');
    expect(body.id).toBeTruthy();
    toRemove.push({ type: 'todo', data: body });
  });

  it('must not accept incorrect body (id)', async () => {
    const res = await request(app)
      .post(`${APIPrefix}/todos`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', sharedData.authorization)
      .send({
        id: 'set',
        name: 'test',
      })
      .expect('Content-Type', /json/)
      .expect(422);
    const body = res.body;
    expect(body).toBeInstanceOf(Object);
    expect(body.message).toBeTruthy();
  });
  
  it('must not accept incorrect body (status)', async () => {
    const res = await request(app)
      .post(`${APIPrefix}/todos`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', sharedData.authorization)
      .send({
        name: 'test',
        status: 'abracadabra'
      })
      .expect('Content-Type', /json/)
      .expect(422);
    const body = res.body;
    expect(body).toBeInstanceOf(Object);
    expect(body.message).toBeTruthy();
  });

  it('must not accept incorrect body (no attributes)', async () => {
    const res = await request(app)
      .post(`${APIPrefix}/todos`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', sharedData.authorization)
      .send({})
      .expect('Content-Type', /json/)
      .expect(422);
    const body = res.body;
    expect(body).toBeInstanceOf(Object);
    expect(body.message).toBeTruthy();
  });

  it('must not accept incorrect requests without authorization', async () => {
    const res = await request(app)
      .post(`${APIPrefix}/todos`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        name: 'test',
      })
      .expect('Content-Type', /json/)
      .expect(422);
    const body = res.body;
    expect(body).toBeInstanceOf(Object);
    expect(body.message).toBeTruthy();
  });

  it('must not accept incorrect authorization', async () => {
    const res = await request(app)
      .post(`${APIPrefix}/todos`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', sharedData.authorization + '1')
      .send({
        name: 'test',
      })
      .expect('Content-Type', /json/)
      .expect(412);
    const body = res.body;
    expect(body).toBeInstanceOf(Object);
    expect(body.message).toBeTruthy();
  });
});

describe('GET /todos', () => {
  it('must returns non-empty list of user todos', async () => {
    const res = await request(app)
      .get(`${APIPrefix}/todos`)
      .set('Accept', 'application/json')
      .set('Authorization', sharedData.authorization)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('must not contains other users todos', async () => {
    const res = await request(app)
      .get(`${APIPrefix}/todos`)
      .set('Accept', 'application/json')
      .set('Authorization', sharedData.authorization)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(res.body).toBeInstanceOf(Array);
    const body = res.body as Array<Todo>;
    const targetAlt = sharedData.todoAlt;
    const user = sharedData.user;
    for (const todo of body) {
      expect(todo.id).not.toBe(targetAlt.id);
      expect(todo.userId).toBe(user.id);
    }
  });
  
  it('must have working filter (status)', async () => {
    const expectedStatus = 'Completed';
    const res = await request(app)
      .get(`${APIPrefix}/todos?status=${expectedStatus}`)
      .set('Accept', 'application/json')
      .set('Authorization', sharedData.authorization)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(res.body).toBeInstanceOf(Array);
    const body = res.body as Array<Todo>;
    const target = sharedData.todoCompleted;
    let exists = false;
    for (const todo of body) {
      expect(todo.status).toBe(expectedStatus);
      if (todo.id === target.id) {
        exists = true;
      }
    }
    expect(exists).toBeTruthy();
  });
});

describe('PUT /todos', () => {
  it('must change user todo (incremental)', async () => {
    const res = await request(app)
      .put(`${APIPrefix}/todos/${sharedData.todo.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', sharedData.authorization)
      .send({
        name: sharedData.todo.name + ' after',
      } as NewTodoBody)
      .expect('Content-Type', /json/)
      .expect(200);
    const body = res.body as Todo;

    expect(body).toBeInstanceOf(Object);
    expect(body.name).toBe(sharedData.todo.name + ' after');
    expect(body.description).toBe(sharedData.todo.description);
  });

  it('must not change user todo on incorrect body', async () => {
    const res = await request(app)
      .put(`${APIPrefix}/todos/${sharedData.todo.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', sharedData.authorization)
      .send({
        id: '13',
        name: sharedData.todo.name + ' after',
      })
      .expect('Content-Type', /json/)
      .expect(422);
    const body = res.body;

    expect(body).toBeInstanceOf(Object);
    expect(body.message).toBeTruthy();
  });
  
  it('must not change user todo without authorization', async () => {
    const res = await request(app)
      .put(`${APIPrefix}/todos/${sharedData.todo.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        name: sharedData.todo.name + ' after',
      })
      .expect('Content-Type', /json/)
      .expect(422);
    const body = res.body;

    expect(body).toBeInstanceOf(Object);
    expect(body.message).toBeTruthy();
  });

  it('must not change other user todo', async () => {
    const res = await request(app)
      .put(`${APIPrefix}/todos/${sharedData.todo.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', sharedData.authorizationAlt)
      .send({
        name: sharedData.todo.name + ' after',
      })
      .expect('Content-Type', /json/)
      .expect(403);
    const body = res.body;

    expect(body).toBeInstanceOf(Object);
    expect(body.message).toBeTruthy();
  });
  
  it('must fail on not existed entry', async () => {
    const res = await request(app)
      .put(`${APIPrefix}/todos/${sharedData.todo.id}123232`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', sharedData.authorization)
      .send({
        name: sharedData.todo.name + ' after',
      })
      .expect('Content-Type', /json/)
      .expect(403);
    const body = res.body;

    expect(body).toBeInstanceOf(Object);
    expect(body.message).toBeTruthy();
  });
});

describe('DELETE /toods', () => {
  it('must delete entry', async () => {
      const res = await request(app)
        .delete(`${APIPrefix}/todos/${sharedData.todo.id}`)
        .set('Accept', 'application/json')
        .set('Authorization', sharedData.authorization)
        .expect('Content-Type', /json/)
        .expect(200);
      const body = res.body as Todo;
  
      expect(body).toBeInstanceOf(Object);
    });
    
  it('must fails if entry already deleted', async () => {
    const res = await request(app)
      .delete(`${APIPrefix}/todos/${sharedData.todo.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', sharedData.authorization)
      .expect('Content-Type', /json/)
      .expect(403);
    const body = res.body;

    expect(body).toBeInstanceOf(Object);
    expect(body.message).toBeTruthy();
  });
  
  it('must fails if entry does not exists', async () => {
    const res = await request(app)
      .delete(`${APIPrefix}/todos/${sharedData.todo.id}321321`)
      .set('Accept', 'application/json')
      .set('Authorization', sharedData.authorization)
      .expect('Content-Type', /json/)
      .expect(403);
    const body = res.body;

    expect(body).toBeInstanceOf(Object);
    expect(body.message).toBeTruthy();
  });
  
  
  it('must fails if entry belongs to other user', async () => {
    const res = await request(app)
      .delete(`${APIPrefix}/todos/${sharedData.todo.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', sharedData.authorizationAlt)
      .expect('Content-Type', /json/)
      .expect(403);
    const body = res.body;

    expect(body).toBeInstanceOf(Object);
    expect(body.message).toBeTruthy();
  });
});
