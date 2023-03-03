import { AsyncRequestHandler } from '@/routes/middlewares';
import { SignUpResponse, SignInResponse, User } from './models';
import db from '@/db';
import { Conflict, Forbidden, Unauthorized } from '@/routes/httpErrors';
import { issueToken } from '@/routes/auth';

export const signup: AsyncRequestHandler<{}, SignUpResponse, User> = async function signup(
  req,
  res,
) {
  const newUser = req.body;
  const foundUser = await db.user.findUnique({
    where: {
      email: newUser.email,
    },
  });

  if (foundUser) {
    throw new Conflict();
  }

  await db.user.create({
    data: newUser,
  });

  res.json({
    ok: true,
  });
};

export const signin: AsyncRequestHandler<{}, SignInResponse, User> = async function signin(
  req,
  res,
) {
  const loggingUser = req.body;
  const user = await db.user.findUnique({
    where: {
      email: loggingUser.email,
    },
  });

  if (!user || user.password !== loggingUser.password) {
    throw new Unauthorized();
  }

  const token = await issueToken({
    u: user.id,
  });

  res.json({
    token,
  });
};

export const changePassword: AsyncRequestHandler<{}, SignUpResponse, User> =
  async function changePassword(req, res) {
    const newUserData = req.body;
    const authUser = req.user;
    if (!authUser) throw new Unauthorized();

    const user = await db.user.findFirst({
      where: {
        id: authUser.id,
      },
    });
    
    if (!user || user.email !== newUserData.email) {
      throw new Forbidden();
    }

    const updatedUser = await db.user.update({
      where: {
        id: authUser.id,
      },
      data: {
        password: newUserData.password,
      },
    });

    res.json({
      ok: !!updatedUser,
    });
  };
