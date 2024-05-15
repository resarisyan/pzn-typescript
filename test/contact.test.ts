import supertest from 'supertest';
import { web } from '../src/application/web';
import { logger } from '../src/application/logging';
import { ContactTest, UserTest } from './test-util';

describe('POST /api/contacts', () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it('should create new contact', async () => {
    const user = await UserTest.me();
    const response = await supertest(web)
      .post('/api/contacts')
      .set('Authorization', `${user.token}`)
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@gmail.com',
        phone: '1234567890',
      });

    logger.debug(response.body);
    expect(response.status).toBe(201);
    expect(response.body.data.firstName).toBe('John');
    expect(response.body.data.lastName).toBe('Doe');
    expect(response.body.data.email).toBe('john@gmail.com');
    expect(response.body.data.phone).toBe('1234567890');
  });

  it('should reject create new contact if request is invalid', async () => {
    const user = await UserTest.me();
    const response = await supertest(web)
      .post('/api/contacts')
      .set('Authorization', `${user.token}`)
      .send({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
      });

    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});

describe('GET /api/contacts/:contactId', () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it('should get contact detail', async () => {
    const user = await UserTest.me();
    const contact = await ContactTest.get();

    const response = await supertest(web)
      .get(`/api/contacts/${contact.id}`)
      .set('Authorization', `${user.token}`);

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.firstName).toBe('Test');
    expect(response.body.data.lastName).toBe('Test');
    expect(response.body.data.email).toBe('test@gmail.com');
    expect(response.body.data.phone).toBe('1234567890');
  });

  it('should reject get contact detail if contact is not found', async () => {
    const user = await UserTest.me();
    const response = await supertest(web)
      .get('/api/contacts/123')
      .set('Authorization', `${user.token}`);

    logger.debug(response.body);
    expect(response.status).toBe(404);
    expect(response.body.message).toBeDefined();
  });
});

describe('PUT /api/contacts/:contactId', () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it('should update contact', async () => {
    const user = await UserTest.me();
    const contact = await ContactTest.get();

    const response = await supertest(web)
      .put(`/api/contacts/${contact.id}`)
      .set('Authorization', `${user.token}`)
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@gmail.com',
        phone: '1234567890',
      });
  });

  it('should reject update contact if request is invalid', async () => {
    const user = await UserTest.me();
    const contact = await ContactTest.get();

    const response = await supertest(web)
      .put(`/api/contacts/${contact.id}`)
      .set('Authorization', `${user.token}`)
      .send({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
      });

    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});

describe('DELETE /api/contacts/:contactId', () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it('should remove contact', async () => {
    const user = await UserTest.me();
    const contact = await ContactTest.get();

    const response = await supertest(web)
      .delete(`/api/contacts/${contact.id}`)
      .set('Authorization', `${user.token}`);

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.message).toBeDefined();
  });

  it('should reject remove contact if contact is not found', async () => {
    const user = await UserTest.me();
    const response = await supertest(web)
      .delete('/api/contacts/123')
      .set('Authorization', `${user.token}`);

    logger.debug(response.body);
    expect(response.status).toBe(404);
    expect(response.body.message).toBeDefined();
  });
});

describe('GET /api/contacts', () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it('should search contact', async () => {
    const user = await UserTest.me();
    const response = await supertest(web)
      .get('/api/contacts')
      .set('Authorization', `${user.token}`);

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
  });

  it('should search contact with query', async () => {
    const user = await UserTest.me();
    const response = await supertest(web)
      .get('/api/contacts?name=Test')
      .set('Authorization', `${user.token}`);

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
  });

  it('should search contact with pagination', async () => {
    const user = await UserTest.me();
    const response = await supertest(web)
      .get('/api/contacts?page=1&size=10')
      .set('Authorization', `${user.token}`);

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
  });

  it('should search contact with query and pagination', async () => {
    const user = await UserTest.me();
    const response = await supertest(web)
      .get('/api/contacts?name=Test&page=1&size=10')
      .set('Authorization', `${user.token}`);

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
  });
});
