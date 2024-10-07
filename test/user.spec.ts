/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('UserController', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;
  let BASE_URL: string;
  let token: string;

  const testUser = {
    username: process.env.TEST_USERNAME,
    email: process.env.TEST_EMAIL,
    password: process.env.TEST_PASSWORD,
  };

  const updatedUser = {
    username: 'updatedUser',
    email: 'updated.email@mail.com',
    password: 'newPassword',
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);

    BASE_URL = '/api/users';

    await testService.deleteAll();
  });

  describe('POST api/users/register', () => {
    it('should return 400 for invalid request', async () => {
      const response = await request(app.getHttpServer())
        .post(`${BASE_URL}/register`)
        .send({
          username: '',
          email: '',
          password: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should create a new user', async () => {
      const response = await request(app.getHttpServer())
        .post(`${BASE_URL}/register`)
        .send(testUser);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe(testUser.username);
      expect(response.body.data.email).toBe(testUser.email);
    });

    it('should return 400 for duplicate email', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post(`${BASE_URL}/register`)
        .send(testUser);

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST api/users/login', () => {
    beforeEach(async () => {
      await testService.createUser();
    });

    it('should return 400 for invalid login request', async () => {
      const response = await request(app.getHttpServer())
        .post(`${BASE_URL}/login`)
        .send({ email: '', password: '' });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should allow login with valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post(`${BASE_URL}/login`)
        .send({ email: testUser.email, password: testUser.password });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe(testUser.username);
      expect(response.body.data.email).toBe(testUser.email);
      expect(response.body.data.token).toBeDefined();
    });
  });

  describe('GET api/users/current', () => {
    beforeEach(async () => {
      await testService.createUser();
      const user = await testService.getUser();
      token = user.token;
    });

    it('should return 401 for invalid token', async () => {
      const response = await request(app.getHttpServer())
        .get(`${BASE_URL}/current`)
        .set('Authorization', 'Invalid token');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should return current user data with valid token', async () => {
      const response = await request(app.getHttpServer())
        .get(`${BASE_URL}/current`)
        .set('Authorization', token);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe(testUser.username);
      expect(response.body.data.email).toBe(testUser.email);
    });
  });

  describe('PATCH api/users/current', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();
      const user = await testService.getUser();
      token = user.token;
    });

    it('should return 400 for invalid update request', async () => {
      const response = await request(app.getHttpServer())
        .patch(`${BASE_URL}/current`)
        .set('Authorization', token)
        .send({ username: '', email: '', password: '' });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should update username successfully', async () => {
      const response = await request(app.getHttpServer())
        .patch(`${BASE_URL}/current`)
        .set('Authorization', token)
        .send({ username: updatedUser.username });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe(updatedUser.username);
      expect(response.body.data.email).toBe(testUser.email);
    });

    it('should update password successfully', async () => {
      let response = await request(app.getHttpServer())
        .patch(`${BASE_URL}/current`)
        .set('Authorization', token)
        .send({ password: updatedUser.password });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe(testUser.username);
      expect(response.body.data.email).toBe(testUser.email);

      // Verify the new password works
      response = await request(app.getHttpServer())
        .post(`${BASE_URL}/login`)
        .send({
          email: testUser.email,
          password: updatedUser.password,
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.token).toBeDefined();
    });
  });

  describe('DELETE api/users/current', () => {
    beforeEach(async () => {
      await testService.createUser();
      const user = await testService.getUser();
      token = user.token;
    });

    it('should return 401 for invalid token', async () => {
      const response = await request(app.getHttpServer())
        .delete(`${BASE_URL}/current`)
        .set('Authorization', 'Invalid token');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to logout user', async () => {
      const response = await request(app.getHttpServer())
        .delete(`${BASE_URL}/current`)
        .set('Authorization', token);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data).toBe(true);

      const user = await testService.getUser();
      expect(user.token).toBeNull();
    });
  });
});
