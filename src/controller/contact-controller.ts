import {
  CreateContactRequest,
  SearchContactRequest,
  UpdateContactRequest,
} from '../model/contact-model';
import { ContactService } from '../service/contact-service';
import { UserRequest } from '../type/user-request';
import { Response, NextFunction } from 'express';

export class ContactController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: CreateContactRequest = req.body as CreateContactRequest;
      const response = await ContactService.create(req.user!, request);
      res.status(201).json({
        success: true,
        message: 'Contact created',
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async get(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.contactId;
      const response = await ContactService.get(req.user!, id);
      res.json({
        success: true,
        message: 'Contact detail',
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: UpdateContactRequest = req.body as UpdateContactRequest;
      request.id = req.params.contactId;

      const response = await ContactService.update(req.user!, request);
      res.json({
        success: true,
        message: 'Contact updated',
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async remove(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.contactId;
      await ContactService.remove(req.user!, id);
      res.json({
        success: true,
        message: 'Contact removed',
      });
    } catch (error) {
      next(error);
    }
  }

  static async search(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: SearchContactRequest = {
        name: req.query.name as string,
        email: req.query.email as string,
        phone: req.query.phone as string,
        page: Number(req.query.page) || 1,
        size: Number(req.query.size) || 10,
      };

      const response = await ContactService.search(req.user!, request);
      res.json({
        success: true,
        message: 'Contact search result',
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }
}
