import { User } from '@prisma/client';
import db from '@/db';
import { generatePasswordHash } from '@/utils';

export const mockedData: {
  email: string;
  emailAlt: string;
} = {
  email: 'test.email@internal.com',
  emailAlt: 'test.alternative.email@internal.com',
};

async function user(email: string, action: 'delete' | 'create'): Promise<User> {
  if (action === 'create') {
    return await db.user.upsert({
      where: {
        email,
      },
      create: {
        email,
        password: generatePasswordHash(email),
      },
      update: {
        password: generatePasswordHash(email),
      },
    });
  } else if (action === 'delete') {
    return await db.user
      .delete({
        where: {
          email,
        },
      })
      .catch((e) => e);
  } else {
    throw new TypeError('Action must be delete or create');
  }
}

export async function initMock() {
  await user(mockedData.email, 'create');
  await user(mockedData.emailAlt, 'create');
}

export async function destroyMock() {
  await user(mockedData.email, 'delete');
  await user(mockedData.emailAlt, 'delete');
}
