/* eslint-disable prettier/prettier */
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { Logger } from 'winston';
import { Contact, User } from '@prisma/client';
import {
  ContactResponse,
  CreateContactRequest,
  SearchContactRequest,
  UpdateContactRequest,
} from '../model/contact.model';
import { ContactValidation } from './contact.validation';
import WebResponse from 'src/model/web.model';

@Injectable()
export class ContactService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService
  ) {}

  toContactResponse(contact: Contact): ContactResponse {
    return {
      id: contact.id,
      first_name: contact.first_name,
      last_name: contact.last_name,
      phone: contact.phone,
      email: contact.email,
    };
  }

  async create(
    user: User,
    request: CreateContactRequest
  ): Promise<ContactResponse> {
    // Logging create contact service
    this.logger.debug(
      `ContactService.CREATE : { User : ${JSON.stringify(user)}, Request : ${JSON.stringify(request)} }`
    );

    // Validation Request
    const createRequest: CreateContactRequest = this.validationService.validate(
      ContactValidation.CREATE,
      request
    );

    const contact = await this.prismaService.contact.create({
      data: {
        ...{ user_email: user.email },
        ...createRequest,
      },
    });

    return this.toContactResponse(contact);
  }

  async existingContact(
    user_email: string,
    contactId: number
  ): Promise<Contact> {
    const contact = await this.prismaService.contact.findFirst({
      where: {
        user_email: user_email,
        id: contactId,
      },
    });

    if (!contact) {
      throw new HttpException('Contact not found', 404);
    }

    return contact;
  }

  async get(user: User, contactId: number): Promise<ContactResponse> {
    this.logger.debug(`ContactService.GET : { User: ${JSON.stringify(user)} }`);

    const contact = await this.existingContact(user.email, contactId);

    return this.toContactResponse(contact);
  }

  async update(
    user: User,
    request: UpdateContactRequest
  ): Promise<ContactResponse> {
    const updateRequest = this.validationService.validate(
      ContactValidation.UPDATE,
      request
    );
    let contact = await this.existingContact(user.email, updateRequest.id);

    contact = await this.prismaService.contact.update({
      where: {
        user_email: contact.user_email,
        id: contact.id,
      },
      data: updateRequest,
    });

    return this.toContactResponse(contact);
  }

  async delete(user: User, contactId: number): Promise<ContactResponse> {
    await this.existingContact(user.email, contactId);

    const contact = await this.prismaService.contact.delete({
      where: {
        user_email: user.email,
        id: contactId,
      },
    });

    return this.toContactResponse(contact);
  }

  async search(
    user: User,
    request: SearchContactRequest
  ): Promise<WebResponse<ContactResponse[]>> {
    const searchRequest: SearchContactRequest = this.validationService.validate(
      ContactValidation.SEARCH,
      request
    );

    const filters = [];

    if (searchRequest.name) {
      // Add name filter
      filters.push({
        OR: [
          {
            first_name: {
              contains: searchRequest.name,
            },
          },
          {
            last_name: {
              contains: searchRequest.name,
            },
          },
        ],
      });
    }

    if (searchRequest.phone) {
      //  Add phone filter
      filters.push({
        phone: {
          contains: searchRequest.phone,
        },
      });
    }

    if (searchRequest.email) {
      // Add email filter
      filters.push({
        email: {
          contains: searchRequest.email,
        },
      });
    }

    const skip = (searchRequest.page - 1) * searchRequest.size;

    const contact = await this.prismaService.contact.findMany({
      where: {
        user_email: user.email,
        AND: filters,
      },
      take: searchRequest.size,
      skip: skip,
    });

    const total = await this.prismaService.contact.count({
      where: {
        user_email: user.email,
        AND: filters,
      },
    });

    return {
      data: contact.map((contact) => this.toContactResponse(contact)),
      paging: {
        current_page: searchRequest.page,
        size: searchRequest.size,
        total_page: Math.ceil(total),
      },
    };
  }
}
