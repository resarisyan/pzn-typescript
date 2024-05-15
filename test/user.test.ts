import supertest from 'supertest';
import { web } from '../src/application/web';
import { logger } from '../src/application/logging';
import { UserTest } from './test-util';
import bcrypt from 'bcrypt';

describe('POST /api/users', () => {
  afterEach(async () => {
    await UserTest.delete();
  });

  it('should reject register new user if request is invalid', async () => {
    const response = await supertest(web).post('/api/users').send({
      username: '',
      name: '',
      password: '',
    });
    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it('shoild register new user', async () => {
    const response = await supertest(web).post('/api/users').send({
      username: 'test',
      name: 'Test',
      password: 'test12345',
    });

    logger.debug(response.body);
    expect(response.status).toBe(201);
    expect(response.body.data.username).toBe('test');
    expect(response.body.data.name).toBe('Test');
  });
});

describe('POST /api/users/login', () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it('should reject login if request is invalid', async () => {
    const response = await supertest(web).post('/api/users/login').send({
      username: '',
      password: '',
    });
    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it('should reject login if username is not found', async () => {
    const response = await supertest(web).post('/api/users/login').send({
      username: 'notfound',
      password: 'test12345',
    });
    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.message).toBeDefined();
  });

  it('should be able to login', async () => {
    const response = await supertest(web).post('/api/users/login').send({
      username: 'test',
      password: 'test12345',
    });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.username).toBe('test');
    expect(response.body.data.name).toBe('Test');
    expect(response.body.data.token).toBeDefined();
  });
});

describe('GET /api/users/me', () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it('should reject if token is not provided', async () => {
    const response = await supertest(web).get('/api/users/me');
    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.message).toBeDefined();
  });

  it('should reject if token is invalid', async () => {
    const response = await supertest(web)
      .get('/api/users/me')
      .set('Authorization', 'invalidtoken');
    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.message).toBeDefined();
  });

  it('should be able to get user profile', async () => {
    const response = await supertest(web)
      .get('/api/users/me')
      .set('Authorization', 'test');
    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.username).toBe('test');
    expect(response.body.data.name).toBe('Test');
  });
});

describe('PATCH /api/users/me', () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it('should reject if token is not provided', async () => {
    const response = await supertest(web).patch('/api/users/me');
    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.message).toBeDefined();
  });

  it('should reject if token is invalid', async () => {
    const response = await supertest(web)
      .patch('/api/users/me')
      .set('Authorization', 'invalidtoken');
    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.message).toBeDefined();
  });

  it('should reject if request is invalid', async () => {
    const response = await supertest(web)
      .patch('/api/users/me')
      .set('Authorization', 'test')
      .send({
        name: '',
        password: '',
      });
    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it('should be able to update user profile', async () => {
    const response = await supertest(web)
      .patch('/api/users/me')
      .set('Authorization', 'test')
      .send({
        name: 'Test Updated',
        password: 'test123456',
      });
    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.username).toBe('test');
    expect(response.body.data.name).toBe('Test Updated');

    const user = await UserTest.me();
    expect(await bcrypt.compare('test123456', user.password)).toBe(true);
  });
});

describe('DELETE /api/users/me', () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it('should reject if token is not provided', async () => {
    const response = await supertest(web).delete('/api/users/me');
    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.message).toBeDefined();
  });

  it('should reject if token is invalid', async () => {
    const response = await supertest(web)
      .delete('/api/users/me')
      .set('Authorization', 'invalidtoken');
    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.message).toBeDefined();
  });

  it('should be able to logout', async () => {
    const response = await supertest(web)
      .delete('/api/users/me')
      .set('Authorization', 'test');
    logger.debug(response.body);
    expect(response.status).toBe(200);
  });
});
