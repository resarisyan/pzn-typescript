import { User } from '@prisma/client';
import { prismaClient } from '../application/database';
import { ResponseError } from '../handler/response-error';
import {
  CreateUserRequest,
  LoginUserRequest,
  UpdateUserRequest,
  UserResponse,
  toUserResponse,
} from '../model/user-model';
import { UserValidation } from '../validation/user-validation';
import { Validation } from '../validation/validation';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

export class UserService {
  static async register(request: CreateUserRequest): Promise<UserResponse> {
    const registerRequest = Validation.validate(
      UserValidation.REGISTER,
      request
    );

    const totalUserWithSameUsername = await prismaClient.user.count({
      where: {
        username: registerRequest.username,
      },
    });

    if (totalUserWithSameUsername > 0) {
      throw new ResponseError(401, 'Username already exists');
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await prismaClient.user.create({
      data: registerRequest,
    });

    return toUserResponse(user);
  }

  static async login(request: LoginUserRequest): Promise<UserResponse> {
    const loginRequest = Validation.validate(UserValidation.LOGIN, request);

    let user = await prismaClient.user.findUnique({
      where: {
        username: loginRequest.username,
      },
    });

    if (!user) {
      throw new ResponseError(401, 'Invalid username or password');
    }

    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new ResponseError(401, 'Invalid username or password');
    }

    user = await prismaClient.user.update({
      where: {
        username: loginRequest.username,
      },
      data: {
        token: uuid(),
      },
    });

    const response = toUserResponse(user);
    response.token = user.token!;
    return response;
  }

  static async me(user: User): Promise<UserResponse> {
    return toUserResponse(user);
  }

  static async update(
    user: User,
    request: UpdateUserRequest
  ): Promise<UserResponse> {
    const updateRequest = Validation.validate(UserValidation.UPDATE, request);

    if (updateRequest.password) {
      updateRequest.password = await bcrypt.hash(updateRequest.password, 10);
    }

    const updatedUser = await prismaClient.user.update({
      where: {
        username: user.username,
      },
      data: updateRequest,
    });

    return toUserResponse(updatedUser);
  }

  static async logout(user: User): Promise<void> {
    await prismaClient.user.update({
      where: {
        username: user.username,
      },
      data: {
        token: null,
      },
    });
  }
}
