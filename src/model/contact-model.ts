import { Contact } from '@prisma/client';

export type ContactResponse = {
  id: string;
  firstName: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
};

export type CreateContactRequest = {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
};

export type UpdateContactRequest = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
};

export type SearchContactRequest = {
    name?: string;
    phone?: string;
    email?: string;
    page: number;
    size: number;
}

export function toContactResponse(contact: Contact): ContactResponse {
  return {
    id: contact.id,
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email,
    phone: contact.phone,
  };
}
