import { Response, NextFunction } from 'express';
import { prismaClient } from '../application/database';
import { UserRequest } from '../type/user-request';

export const authMiddleware = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  if (token) {
    const user = await prismaClient.user.findFirst({
      where: {
        token: token,
      },
    });

    if (user) {
      req.user = user;
      return next();
    }
  }

  res
    .status(401)
    .json({
      success: false,
      message: 'Unauthorized',
    })
    .end();
};
