import request from 'supertest';
import app from '@/app';
import { APIPrefix } from '..';
import { Todo, User } from '@prisma/client';
import db from '@/db';
import { mockedData } from '@/tests/mockData';
import { User as UserModel } from './models';
import { generatePasswordHash } from '@/utils';

const testEmail = 'test.newone@internal.com';
const toRemove: Array<{ type: 'user'; data: User } | { type: 'todo'; data: Todo }> = [
  { type: 'user', data: { email: testEmail } as User },
];

const sharedData: {
  user: User;
  userAlt: User;
  token: string;
  tokenAlt: string;
  authorization: string;
  authorizationAlt: string;
} = {
  user: null as any,
  userAlt: null as any,
  token: '',
  tokenAlt: '',
  authorization: 'Bearer ',
  authorizationAlt: 'Bearer ',
};

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
});

afterAll(async () => {
  for (const object of toRemove) {
    if (object.type === 'user') {
      await db.user
        .delete({
          where: {
            id: object.data.id,
            email: object.data.email,
          },
        })
        .catch((e) => e);
    } else if (object.type === 'todo') {
      await db.todo
        .delete({
          where: {
            id: object.data.id,
          },
        })
        .catch((e) => e);
    }
  }
});

describe('POST /signup', () => {
  it('must create new user', async () => {
    const res = await request(app)
      .post(`${APIPrefix}/signup`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        email: testEmail,
        password: generatePasswordHash(testEmail),
      } as UserModel)
      .expect('Content-Type', /json/)
      .expect(200);
    const body = res.body;
    expect(body).toBeInstanceOf(Object);
    expect(body.ok).toBeTruthy();
  });

  it('must not create new user with same email', async () => {
    const res = await request(app)
      .post(`${APIPrefix}/signup`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        email: testEmail,
        password: generatePasswordHash(testEmail + '2'),
      } as UserModel)
      .expect('Content-Type', /json/)
      .expect(409);
    const body = res.body;
    expect(body).toBeInstanceOf(Object);
    expect(body.message).toBeTruthy();
  });

  it('must not create new user with incorrect email', async () => {
    const res = await request(app)
      .post(`${APIPrefix}/signup`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        email: 'wrong.email.com@',
        password: generatePasswordHash(testEmail),
      } as UserModel)
      .expect('Content-Type', /json/)
      .expect(422);
    const body = res.body;
    expect(body).toBeInstanceOf(Object);
    expect(body.message).toBeTruthy();
  });

  it('must not create new user with incorrect password hash', async () => {
    const res = await request(app)
      .post(`${APIPrefix}/signup`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        email: testEmail,
        password: '3213213',
      } as UserModel)
      .expect('Content-Type', /json/)
      .expect(422);
    const body = res.body;
    expect(body).toBeInstanceOf(Object);
    expect(body.message).toBeTruthy();
  });
});

describe('POST /signin', () => {
  it('must successfully login', async () => {
    const res = await request(app)
      .post(`${APIPrefix}/signin`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        email: testEmail,
        password: generatePasswordHash(testEmail),
      } as UserModel)
      .expect('Content-Type', /json/)
      .expect(200);
    const body = res.body;
    expect(body).toBeInstanceOf(Object);
    expect(body.token).toBeTruthy();
  });

  it('must fail on incorrect credentials', async () => {
    const res = await request(app)
      .post(`${APIPrefix}/signin`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        email: testEmail,
        password: generatePasswordHash('2'),
      } as UserModel)
      .expect('Content-Type', /json/)
      .expect(401);
    const body = res.body;
    expect(body).toBeInstanceOf(Object);
    expect(body.message).toBeTruthy();
  });

  it('must fail with incorrect email', async () => {
    const res = await request(app)
      .post(`${APIPrefix}/signin`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        email: 'wrong.email.com@',
        password: generatePasswordHash(testEmail),
      } as UserModel)
      .expect('Content-Type', /json/)
      .expect(422);
    const body = res.body;
    expect(body).toBeInstanceOf(Object);
    expect(body.message).toBeTruthy();
  });

  it('must fail with incorrect password hash', async () => {
    const res = await request(app)
      .post(`${APIPrefix}/signin`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        email: testEmail,
        password: '3213213',
      } as UserModel)
      .expect('Content-Type', /json/)
      .expect(422);
    const body = res.body;
    expect(body).toBeInstanceOf(Object);
    expect(body.message).toBeTruthy();
  });
});

describe('PUT /changePassword', () => {
  it('must successfully change password', async () => {
    const res = await request(app)
      .put(`${APIPrefix}/changePassword`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', sharedData.authorizationAlt)
      .send({
        email: sharedData.userAlt.email,
        password: generatePasswordHash(sharedData.userAlt.email + '2'),
      } as UserModel)
      .expect('Content-Type', /json/)
      .expect(200);
    const body = res.body;
    expect(body).toBeInstanceOf(Object);
    expect(body.ok).toBeTruthy();
  });

  it('must fail on incorrect authorization', async () => {
    const res = await request(app)
      .put(`${APIPrefix}/changePassword`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', sharedData.authorization)
      .send({
        email: sharedData.userAlt.email,
        password: generatePasswordHash(sharedData.userAlt.email + '2'),
      } as UserModel)
      .expect('Content-Type', /json/)
      .expect(403);
    const body = res.body;
    expect(body).toBeInstanceOf(Object);
    expect(body.message).toBeTruthy();
  });

  it('must fail with incorrect email', async () => {
    const res = await request(app)
      .put(`${APIPrefix}/changePassword`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', sharedData.authorization)
      .send({
        email: 'wrong.email.com@',
        password: generatePasswordHash(testEmail),
      } as UserModel)
      .expect('Content-Type', /json/)
      .expect(422);
    const body = res.body;
    expect(body).toBeInstanceOf(Object);
    expect(body.message).toBeTruthy();
  });

  it('must fail with incorrect password hash', async () => {
    const res = await request(app)
      .put(`${APIPrefix}/changePassword`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        email: testEmail,
        password: '3213213',
      } as UserModel)
      .expect('Content-Type', /json/)
      .expect(422);
    const body = res.body;
    expect(body).toBeInstanceOf(Object);
    expect(body.message).toBeTruthy();
  });
});
