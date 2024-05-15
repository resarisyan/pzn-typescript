import { Contact, User } from '@prisma/client';
import {
  CreateContactRequest,
  ContactResponse,
  toContactResponse,
  UpdateContactRequest,
  SearchContactRequest,
} from '../model/contact-model';
import { ContactValidation } from '../validation/contact-validation';
import { Validation } from '../validation/validation';
import { prismaClient } from '../application/database';
import { ResponseError } from '../handler/response-error';
import { Pageable } from '../model/page';

export class ContactService {
  static async create(
    user: User,
    request: CreateContactRequest
  ): Promise<ContactResponse> {
    const createRequest = Validation.validate(
      ContactValidation.CREATE,
      request
    );
    const record = {
      ...createRequest,
      ...{ username: user.username },
    };

    const contact = await prismaClient.contact.create({
      data: record,
    });

    return toContactResponse(contact);
  }

  static async get(user: User, id: string): Promise<ContactResponse> {
    return await ContactService.checkContactMustExist(user, id);
  }

  static async update(
    user: User,
    request: UpdateContactRequest
  ): Promise<ContactResponse> {
    const updateRequest = Validation.validate(
      ContactValidation.UPDATE,
      request
    );

    await ContactService.checkContactMustExist(user, updateRequest.id);
    const contact = await prismaClient.contact.update({
      where: {
        id: updateRequest.id,
      },
      data: updateRequest,
    });

    return toContactResponse(contact);
  }

  static async remove(user: User, id: string): Promise<void> {
    await ContactService.checkContactMustExist(user, id);
    await prismaClient.contact.delete({
      where: {
        id,
        username: user.username,
      },
    });
  }

  static async search(
    user: User,
    request: SearchContactRequest
  ): Promise<Pageable<ContactResponse>> {
    const searchRequest = Validation.validate(
      ContactValidation.SEARCH,
      request
    );
    const skip = (searchRequest.page - 1) * searchRequest.size;
    const filters = [];

    if (searchRequest.name) {
      filters.push({
        OR: [
          { firstName: { contains: searchRequest.name } },
          { lastName: { contains: searchRequest.name } },
        ],
      });
    }

    if (searchRequest.phone) {
      filters.push({ phone: { contains: searchRequest.phone } });
    }

    if (searchRequest.email) {
      filters.push({ email: { contains: searchRequest.email } });
    }

    const contacts = await prismaClient.contact.findMany({
      where: {
        username: user.username,
        AND: filters,
      },
      take: searchRequest.size,
      skip,
    });

    const total = await prismaClient.contact.count({
      where: {
        username: user.username,
        AND: filters,
      },
    });

    return {
      data: contacts.map(toContactResponse),
      paging: {
        size: searchRequest.size,
        current_page: searchRequest.page,
        total_page: Math.ceil(contacts.length / searchRequest.size),
      },
    };
  }

  static async checkContactMustExist(user: User, id: string): Promise<Contact> {
    const contact = await prismaClient.contact.findFirst({
      where: {
        id,
        username: user.username,
      },
    });

    if (!contact) {
      throw new ResponseError(404, 'Contact not found');
    }

    return contact;
  }
}
