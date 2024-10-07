/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('ContactController', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;
  let BASE_URL: string;
  let token: string;
  let contactId: number;

  const testContact = {
    first_name: process.env.TEST_CONTACT_FIRST_NAME,
    last_name: process.env.TEST_CONTACT_LAST_NAME,
    phone: process.env.TEST_CONTACT_PHONE,
    email: process.env.TEST_CONTACT_EMAIL,
  };

  const updatedContact = {
    first_name: process.env.TEST_CONTACT_UPDATED_FIRST_NAME,
    last_name: process.env.TEST_CONTACT_UPDATED_LAST_NAME,
    phone: process.env.TEST_CONTACT_UPDATED_PHONE,
    email: process.env.TEST_CONTACT_UPDATED_EMAIL,
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);

    BASE_URL = '/api/contacts';

    await testService.deleteAll();
  });

  describe('POST api/contacts', () => {
    beforeEach(async () => {
      await testService.createUser();

      const user = await testService.getUser();
      token = user.token;
    });

    it('should return 400 for invalid request', async () => {
      const response = await request(app.getHttpServer())
        .post(`${BASE_URL}`)
        .set('Authorization', token);

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should create a new contact', async () => {
      await testService.createContact();
      const response = await request(app.getHttpServer())
        .post(`${BASE_URL}`)
        .set('Authorization', token)
        .send(testContact);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.first_name).toBe(testContact.first_name);
      expect(response.body.data.last_name).toBe(testContact.last_name);
      expect(response.body.data.phone).toBe(testContact.phone);
      expect(response.body.data.email).toBe(testContact.email);
    });
  });

  describe('GET api/contacts/:contactId', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createContact();

      const user = await testService.getUser();
      const contact = await testService.getContact();

      token = user.token;
      contactId = contact.id;
    });

    it('should return 404 if contact not found', async () => {
      const response = await request(app.getHttpServer())
        .get(`${BASE_URL}/${contactId + 1}`)
        .set('Authorization', token);

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should get a contact', async () => {
      const response = await request(app.getHttpServer())
        .get(`${BASE_URL}/${contactId}`)
        .set('Authorization', token);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.first_name).toBe(testContact.first_name);
      expect(response.body.data.last_name).toBe(testContact.last_name);
      expect(response.body.data.phone).toBe(testContact.phone);
      expect(response.body.data.email).toBe(testContact.email);
    });
  });

  describe('PUT api/contacts/:contactId', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createContact();

      const user = await testService.getUser();
      const contact = await testService.getContact();

      token = user.token;
      contactId = contact.id;
    });

    it('should return 400 for invalid request', async () => {
      const response = await request(app.getHttpServer())
        .put(`${BASE_URL}/${contactId}`)
        .set('Authorization', token)
        .send({
          first_name: '',
          last_name: '',
          phone: '',
          email: 'invalid email',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should return 404 if contact not found', async () => {
      const response = await request(app.getHttpServer())
        .put(`${BASE_URL}/${contactId + 1}`)
        .set('Authorization', token)
        .send(updatedContact);

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should update a contact', async () => {
      await testService.createContact();
      const response = await request(app.getHttpServer())
        .put(`${BASE_URL}/${contactId}`)
        .set('Authorization', token)
        .send(updatedContact);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.first_name).toBe(updatedContact.first_name);
      expect(response.body.data.last_name).toBe(updatedContact.last_name);
      expect(response.body.data.phone).toBe(updatedContact.phone);
      expect(response.body.data.email).toBe(updatedContact.email);
    });
  });

  describe('DELETE api/contacts/:contactId', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createContact();

      const user = await testService.getUser();
      const contact = await testService.getContact();

      token = user.token;
      contactId = contact.id;
    });

    it('should return 404 if contact not found', async () => {
      const response = await request(app.getHttpServer())
        .delete(`${BASE_URL}/${contactId + 1}`)
        .set('Authorization', token);

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should delete a contact', async () => {
      const response = await request(app.getHttpServer())
        .delete(`${BASE_URL}/${contactId}`)
        .set('Authorization', token);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data).toBe(true);
    });
  });

  describe('GET api/contacts', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createContact();

      const user = await testService.getUser();
      const contact = await testService.getContact();

      token = user.token;
      contactId = contact.id;
    });

    it('should be able search contact', async () => {
      const response = await request(app.getHttpServer())
        .get(`${BASE_URL}`)
        .set('Authorization', token);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });

    it('should be able search contact by name', async () => {
      const response = await request(app.getHttpServer())
        .get(`${BASE_URL}`)
        .query({
          name: 'es',
        })
        .set('Authorization', token);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });

    it('should return 404 if the contact is not found when searching by name.', async () => {
      const response = await request(app.getHttpServer())
        .get(`${BASE_URL}`)
        .query({
          name: 'zz',
        })
        .set('Authorization', token);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
    });

    it('should be able search contact by phone', async () => {
      const response = await request(app.getHttpServer())
        .get(`${BASE_URL}`)
        .query({
          phone: '66',
        })
        .set('Authorization', token);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });

    it('should return 404 if the contact is not found when searching by phone.', async () => {
      const response = await request(app.getHttpServer())
        .get(`${BASE_URL}`)
        .query({
          phone: '00',
        })
        .set('Authorization', token);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
    });

    it('should be able search contact by email', async () => {
      const response = await request(app.getHttpServer())
        .get(`${BASE_URL}`)
        .query({
          email: 'act',
        })
        .set('Authorization', token);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });

    it('should return 404 if the contact is not found when searching by email.', async () => {
      const response = await request(app.getHttpServer())
        .get(`${BASE_URL}`)
        .query({
          email: 'invalid email',
        })
        .set('Authorization', token);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
    });

    it('should be able search contact with page', async () => {
      const response = await request(app.getHttpServer())
        .get(`${BASE_URL}`)
        .query({
          size: 1,
          page: 2,
        })
        .set('Authorization', token);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
      expect(response.body.paging.current_page).toBe(2);
      expect(response.body.paging.total_page).toBe(1);
      expect(response.body.paging.size).toBe(1);
    });
  });
});
