import { Request, Response, NextFunction } from 'express';
import { CreateUserRequest, UpdateUserRequest } from '../model/user-model';
import { UserService } from '../service/user-service';
import { UserRequest } from '../type/user-request';
export class UserController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CreateUserRequest = req.body as CreateUserRequest;
      const response = await UserService.register(request);
      res.status(201).json({
        success: true,
        message: 'User created',
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CreateUserRequest = req.body as CreateUserRequest;
      const response = await UserService.login(request);
      res.json({
        success: true,
        message: 'User logged in',
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async me(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await UserService.me(req.user!);
      res.json({
        success: true,
        message: 'User profile',
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: UpdateUserRequest = req.body as UpdateUserRequest;
      const response = await UserService.update(req.user!, request);
      res.json({
        success: true,
        message: 'User updated',
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: UserRequest, res: Response, next: NextFunction) {
    try {
      await UserService.logout(req.user!);
      res.json({
        success: true,
        message: 'User logged out',
      });
    } catch (error) {
      next(error);
    }
  }
}
