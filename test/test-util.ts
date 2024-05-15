import { User } from '@prisma/client';
import { prismaClient } from '../src/application/database';
import bcrypt from 'bcrypt';

export class UserTest {
  static async delete() {
    await prismaClient.user.deleteMany({
      where: {
        username: 'test',
      },
    });
  }

  static async create() {
    await prismaClient.user.create({
      data: {
        username: 'test',
        name: 'Test',
        password: await bcrypt.hash('test12345', 10),
        token: 'test',
      },
    });
  }

  static async me(): Promise<User> {
    const user = await prismaClient.user.findFirst({
      where: {
        token: 'test',
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}

export class ContactTest {
  static async deleteAll() {
    await prismaClient.contact.deleteMany({
      where: {
        username: 'test',
      },
    });
  }

  static async create() {
    await prismaClient.contact.create({
      data: {
        firstName: 'Test',
        lastName: 'Test',
        phone: '1234567890',
        email: 'test@gmail.com',
        username: 'test',
      },
    });
  }

  static async get() {
    const contact = await prismaClient.contact.findFirst({
      where: {
        username: 'test',
      },
    });

    if (!contact) {
      throw new Error('Contact not found');
    }

    return contact;
  }
}
