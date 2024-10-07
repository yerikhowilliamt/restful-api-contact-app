/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('AddressController', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;
  let BASE_URL: string;
  let token: string;

  const testAddress = {
    street: process.env.TEST_ADDRESS_STREET,
    city: process.env.TEST_ADDRESS_CITY,
    province: process.env.TEST_ADDRESS_PROVINCE,
    country: process.env.TEST_ADDRESS_COUNTRY,
    postal_code: process.env.TEST_ADDRESS_POSTAL_CODE,
  };

  const updatedAddress = {
    street: process.env.TEST_ADDRESS_UPDATED_STREET,
    city: process.env.TEST_ADDRESS_UPDATED_CITY,
    province: process.env.TEST_ADDRESS_UPDATED_PROVINCE,
    country: process.env.TEST_ADDRESS_UPDATED_COUNTRY,
    postal_code: process.env.TEST_ADDRESS_UPDATED_POSTAL_CODE,
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
    BASE_URL = `/api/contacts`;

    await testService.deleteAll();
  });

  describe('POST /api/contacts/:contactId/addresses', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createContact();
    });

    it('should return 400 for invalid request', async () => {
      const user = await testService.getUser();
      const contact = await testService.getContact();
      token = user.token;
      const response = await request(app.getHttpServer())
        .post(`${BASE_URL}/${contact.id}/addresses`)
        .set('Authorization', token)
        .send({
          street: '',
          city: '',
          province: '',
          country: '',
          postal_code: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should create a new address', async () => {
      const user = await testService.getUser();
      const contact = await testService.getContact();
      token = user.token;
      const response = await request(app.getHttpServer())
        .post(`${BASE_URL}/${contact.id}/addresses`)
        .set('Authorization', token)
        .send(testAddress);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.street).toBe(testAddress.street);
      expect(response.body.data.city).toBe(testAddress.city);
      expect(response.body.data.province).toBe(testAddress.province);
      expect(response.body.data.country).toBe(testAddress.country);
      expect(response.body.data.postal_code).toBe(testAddress.postal_code);
    });
  });

  describe('GET /api/contacts/:contactId/addresses/addressId', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createContact();
      await testService.createAddress();
    });

    it('should return 404 if contact not found', async () => {
      const user = await testService.getUser();
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      token = user.token;
      const response = await request(app.getHttpServer())
        .get(`${BASE_URL}/${contact.id + 1}/addresses/${address.id}`)
        .set('Authorization', token);

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should return 404 if address not found', async () => {
      const user = await testService.getUser();
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      token = user.token;
      const response = await request(app.getHttpServer())
        .get(`${BASE_URL}/${contact.id}/addresses/${address.id + 1}`)
        .set('Authorization', token);

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should get address', async () => {
      const user = await testService.getUser();
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      token = user.token;
      await testService.createContact();
      const response = await request(app.getHttpServer())
        .get(`${BASE_URL}/${contact.id}/addresses/${address.id}`)
        .set('Authorization', token);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.street).toBe(testAddress.street);
      expect(response.body.data.city).toBe(testAddress.city);
      expect(response.body.data.province).toBe(testAddress.province);
      expect(response.body.data.country).toBe(testAddress.country);
      expect(response.body.data.postal_code).toBe(testAddress.postal_code);
    });
  });

  describe('PUT /api/contacts/:contactId/addresses/addressId', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createContact();
      await testService.createAddress();
    });

    it('should return 404 if contact not found', async () => {
      const user = await testService.getUser();
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      token = user.token;
      const response = await request(app.getHttpServer())
        .put(`${BASE_URL}/${contact.id + 1}/addresses/${address.id}`)
        .set('Authorization', token)
        .send(updatedAddress);

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should return 404 if address not found', async () => {
      const user = await testService.getUser();
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      token = user.token;
      const response = await request(app.getHttpServer())
        .put(`${BASE_URL}/${contact.id}/addresses/${address.id + 1}`)
        .set('Authorization', token)
        .send(updatedAddress);

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should return 400 for invalid request', async () => {
      const user = await testService.getUser();
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      token = user.token;
      const response = await request(app.getHttpServer())
        .put(`${BASE_URL}/${contact.id}/addresses/${address.id}`)
        .set('Authorization', token)
        .send({
          street: '',
          city: '',
          province: '',
          country: '',
          postal_code: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should update address', async () => {
      const user = await testService.getUser();
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      token = user.token;
      const response = await request(app.getHttpServer())
        .put(`${BASE_URL}/${contact.id}/addresses/${address.id}`)
        .set('Authorization', token)
        .send(updatedAddress);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.street).toBe(updatedAddress.street);
      expect(response.body.data.city).toBe(updatedAddress.city);
      expect(response.body.data.province).toBe(updatedAddress.province);
      expect(response.body.data.country).toBe(updatedAddress.country);
      expect(response.body.data.postal_code).toBe(updatedAddress.postal_code);
    });
  });

  describe('DELETE /api/contacts/:contactId/addresses/addressId', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createContact();
      await testService.createAddress();
    });

    it('should return 404 if contact not found', async () => {
      const user = await testService.getUser();
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      token = user.token;
      const response = await request(app.getHttpServer())
        .delete(`${BASE_URL}/${contact.id + 1}/addresses/${address.id}`)
        .set('Authorization', token);

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should return 404 if address not found', async () => {
      const user = await testService.getUser();
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      token = user.token;
      const response = await request(app.getHttpServer())
        .delete(`${BASE_URL}/${contact.id}/addresses/${address.id + 1}`)
        .set('Authorization', token);

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should delete address', async () => {
      const user = await testService.getUser();
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      token = user.token;
      const response = await request(app.getHttpServer())
        .delete(`${BASE_URL}/${contact.id}/addresses/${address.id}`)
        .set('Authorization', token);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data).toBe(true);

      const addressResult = await testService.getAddress();
      expect(addressResult).toBeNull();
    });
  });

  describe('GET /api/contacts/:contactId/addresses', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createContact();
      await testService.createAddress();
    });

    it('should return 404 if contact not found', async () => {
      const user = await testService.getUser();
      const contact = await testService.getContact();
      token = user.token;
      const response = await request(app.getHttpServer())
        .get(`${BASE_URL}/${contact.id + 1}/addresses`)
        .set('Authorization', token);

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should get list address', async () => {
      const user = await testService.getUser();
      const contact = await testService.getContact();
      token = user.token;
      await testService.createContact();
      const response = await request(app.getHttpServer())
        .get(`${BASE_URL}/${contact.id}/addresses`)
        .set('Authorization', token);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].id).toBeDefined();
      expect(response.body.data[0].street).toBe(testAddress.street);
      expect(response.body.data[0].city).toBe(testAddress.city);
      expect(response.body.data[0].province).toBe(testAddress.province);
      expect(response.body.data[0].country).toBe(testAddress.country);
      expect(response.body.data[0].postal_code).toBe(testAddress.postal_code);
    });
  });
});
