/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';
import * as bcrypt from 'bcryptjs';
import { Address, Contact, User } from '@prisma/client';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  private readonly testUsername = process.env.TEST_USERNAME;
  private readonly testEmail = process.env.TEST_EMAIL;
  private readonly testPassword = process.env.TEST_PASSWORD;
  private readonly testToken = process.env.TEST_TOKEN;

  private readonly contactFirstname = process.env.TEST_CONTACT_FIRST_NAME;
  private readonly contactLastname = process.env.TEST_CONTACT_LAST_NAME;
  private readonly contactPhone = process.env.TEST_CONTACT_PHONE;
  private readonly contactEmail = process.env.TEST_CONTACT_EMAIL;

  private readonly addressStreet = process.env.TEST_ADDRESS_STREET;
  private readonly addressCity = process.env.TEST_ADDRESS_CITY;
  private readonly addressProvince = process.env.TEST_ADDRESS_PROVINCE;
  private readonly addressCountry = process.env.TEST_ADDRESS_COUNTRY;
  private readonly addressPostalCode = process.env.TEST_ADDRESS_POSTAL_CODE;

  async deleteUser(email = this.testEmail) {
    await this.prismaService.user.deleteMany({
      where: {
        email,
      },
    });
  }

  async deleteContact(user_email = this.testEmail) {
    await this.prismaService.contact.deleteMany({
      where: {
        user_email,
      },
    });
  }

  async deleteAddress(user_email = this.testEmail) {
    await this.prismaService.address.deleteMany({
      where: {
        contact: {
          user_email,
        },
      },
    });
  }

  async deleteAll() {
    await this.deleteAddress();
    await this.deleteContact();
    await this.deleteUser();
  }

  async createUser() {
    const hashedPassword = await bcrypt.hash(this.testPassword, 10);
    await this.prismaService.user.create({
      data: {
        username: this.testUsername,
        email: this.testEmail,
        password: hashedPassword,
        token: this.testToken,
      },
    });
  }

  async createContact() {
    await this.prismaService.contact.create({
      data: {
        user_email: this.testEmail,
        first_name: this.contactFirstname,
        last_name: this.contactLastname,
        phone: this.contactPhone,
        email: this.contactEmail,
      },
    });
  }

  async createAddress() {
    const contact = await this.getContact();
    await this.prismaService.address.create({
      data: {
        contact_id: contact.id,
        street: this.addressStreet,
        city: this.addressCity,
        province: this.addressProvince,
        country: this.addressCountry,
        postal_code: this.addressPostalCode,
      },
    });
  }

  async getUser(email = this.testEmail): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }

  async getContact(user_email = this.testEmail): Promise<Contact> {
    return await this.prismaService.contact.findFirst({
      where: {
        user_email,
      },
    });
  }

  async getAddress(user_email = this.testEmail): Promise<Address> {
    return await this.prismaService.address.findFirst({
      where: {
        contact: {
          user_email,
        },
      },
    });
  }
}
