/* eslint-disable prettier/prettier */
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { Logger } from 'winston';
import { Address, User } from '@prisma/client';
import {
  AddressResponse,
  CreateAddressRequest,
  DeleteAddressRequest,
  GetAddressRequest,
  UpdateAddressRequest,
} from '../model/address.model';
import { AddressValidation } from './address.validation';
import { ContactService } from '../contact/contact.service';

@Injectable()
export class AddressService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
    private contactService: ContactService
  ) {}

  toAddressResponse(address: Address): AddressResponse {
    return {
      id: address.id,
      street: address.street,
      city: address.city,
      province: address.province,
      country: address.country,
      postal_code: address.postal_code,
    };
  }

  async existingAddress(
    contactId: number,
    addressId: number
  ): Promise<Address> {
    const address = await this.prismaService.address.findFirst({
      where: {
        contact_id: contactId,
        id: addressId,
      },
    });

    if (!address) {
      throw new HttpException('Address not found', 404);
    }

    return address;
  }

  async create(
    user: User,
    request: CreateAddressRequest
  ): Promise<AddressResponse> {
    this.logger.debug(
      `Address_Service.CREATE: { User: ${JSON.stringify(user)}, Request: ${JSON.stringify(request)} }`
    );
    const createRequest: CreateAddressRequest = this.validationService.validate(
      AddressValidation.CREATE,
      request
    );

    await this.contactService.existingContact(
      user.email,
      createRequest.contact_id
    );

    const address = await this.prismaService.address.create({
      data: createRequest,
    });

    return this.toAddressResponse(address);
  }

  async get(user: User, request: GetAddressRequest): Promise<AddressResponse> {
    const getRequest: GetAddressRequest = this.validationService.validate(
      AddressValidation.GET,
      request
    );

    await this.contactService.existingContact(
      user.email,
      getRequest.contact_id
    );

    const address = await this.existingAddress(
      getRequest.contact_id,
      getRequest.address_id
    );

    return this.toAddressResponse(address);
  }

  async update(
    user: User,
    request: UpdateAddressRequest
  ): Promise<AddressResponse> {
    const updateRequest: UpdateAddressRequest = this.validationService.validate(
      AddressValidation.UPDATE,
      request
    );

    await this.contactService.existingContact(
      user.email,
      updateRequest.contact_id
    );

    let address = await this.existingAddress(
      updateRequest.contact_id,
      updateRequest.id
    );

    address = await this.prismaService.address.update({
      where: {
        id: address.id,
        contact_id: address.contact_id,
      },
      data: updateRequest,
    });

    return this.toAddressResponse(address);
  }

  async delete(
    user: User,
    request: DeleteAddressRequest
  ): Promise<AddressResponse> {
    const deleteRequest: DeleteAddressRequest = this.validationService.validate(
      AddressValidation.DELETE,
      request
    );

    await this.contactService.existingContact(
      user.email,
      deleteRequest.contact_id
    );

    await this.existingAddress(
      deleteRequest.contact_id,
      deleteRequest.address_id
    );

    const address = await this.prismaService.address.delete({
      where: {
        id: deleteRequest.address_id,
        contact_id: deleteRequest.contact_id,
      },
    });

    return this.toAddressResponse(address);
  }

  async list(user: User, contactId: number): Promise<AddressResponse[]> {
    await this.contactService.existingContact(user.email, contactId);

    const addresses = await this.prismaService.address.findMany({
      where: {
        contact_id: contactId,
      },
    });

    return addresses.map((address) => this.toAddressResponse(address));
  }
}
