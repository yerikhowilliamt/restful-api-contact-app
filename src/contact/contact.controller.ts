/* eslint-disable prettier/prettier */
import {
  Body,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Put,
  Query,
} from '@nestjs/common';
import { Controller, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { Auth } from '../common/auth.decorator';
import {
  ContactResponse,
  CreateContactRequest,
  SearchContactRequest,
  UpdateContactRequest,
} from '../model/contact.model';
import WebResponse from '../model/web.model';
import { ContactService } from './contact.service';

@Controller('/api/contacts')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Post()
  @HttpCode(200)
  async create(
    @Auth() user: User,
    @Body() request: CreateContactRequest
  ): Promise<WebResponse<ContactResponse>> {
    const result = await this.contactService.create(user, request);

    return {
      data: result,
    };
  }

  @Get('/:contactId')
  @HttpCode(200)
  async get(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number
  ): Promise<WebResponse<ContactResponse>> {
    const result = await this.contactService.get(user, contactId);

    return {
      data: result,
    };
  }

  @Put('/:contactId')
  @HttpCode(200)
  async update(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Body() request: UpdateContactRequest
  ): Promise<WebResponse<ContactResponse>> {
    request.id = contactId;
    const result = await this.contactService.update(user, request);

    return {
      data: result,
    };
  }

  @Delete('/:contactId')
  @HttpCode(200)
  async delete(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number
  ): Promise<WebResponse<boolean>> {
    await this.contactService.delete(user, contactId);

    return {
      data: true,
    };
  }

  @Get()
  @HttpCode(200)
  async search(
    @Auth() user: User,
    @Query('name') name?: string,
    @Query('phone') phone?: string,
    @Query('email') email?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('size', new ParseIntPipe({ optional: true })) size?: number
  ): Promise<WebResponse<ContactResponse[]>> {
    const request: SearchContactRequest = {
      name: name,
      phone: phone,
      email: email,
      page: page || 1,
      size: size || 10,
    };

    return this.contactService.search(user, request);
  }
}
