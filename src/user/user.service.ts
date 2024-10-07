/* eslint-disable prettier/prettier */
import { HttpException, Inject, Injectable } from '@nestjs/common';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UpdateUserRequest,
  UserResponse,
} from '../model/user.model';
import { ValidationService } from '../common/validation.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService
  ) {}
  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.info(
      `New user Created : { User : ${JSON.stringify(request)} }`
    );
    const registerRequest: RegisterUserRequest =
      await this.validationService.validate(UserValidation.REGISTER, request);

    const existingUser = await this.prismaService.user.count({
      where: {
        email: registerRequest.email,
      },
    });

    if (existingUser != 0) {
      throw new HttpException('This email is already registered.', 400);
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await this.prismaService.user.create({
      data: registerRequest,
    });

    return {
      username: user.username,
      email: user.email,
    };
  }

  async login(request: LoginUserRequest): Promise<UserResponse> {
    this.logger.debug(`UserService.LOGIN : ${JSON.stringify(request)}`);
    const loginRequest: LoginUserRequest = this.validationService.validate(
      UserValidation.LOGIN,
      request
    );

    let user = await this.prismaService.user.findUnique({
      where: {
        email: loginRequest.email,
      },
    });

    if (!user) {
      throw new HttpException('Username or password is invalid', 401);
    }

    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new HttpException('Username or password is invalid', 401);
    }

    user = await this.prismaService.user.update({
      where: {
        email: loginRequest.email,
      },
      data: {
        token: uuid(),
      },
    });

    return {
      username: user.username,
      email: user.email,
      token: user.token,
    };
  }

  async get(user: User): Promise<UserResponse> {
    this.logger.debug(`UserService.UPDATE : { User: ${JSON.stringify(user)} }`);
    return {
      username: user.username,
      email: user.email,
    };
  }

  async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
    this.logger.debug(
      `UserService.UPDATE : { User: ${JSON.stringify(user)}, Request: ${JSON.stringify(request)} }`
    );

    const updateRequest: UpdateUserRequest = this.validationService.validate(
      UserValidation.UPDATE,
      request
    );

    const existingUser = await this.prismaService.user.findUnique({
      where: { email: user.email },
    });

    if (!existingUser) {
      this.logger.error(`User with email ${user.email} not found`);
      throw new HttpException(`User with email ${user.email} not found`, 404);
    }

    // Update data pengguna
    if (updateRequest.username) {
      user.username = updateRequest.username;
    }

    if (updateRequest.password) {
      user.password = await bcrypt.hash(updateRequest.password, 10);
    }

    const result = await this.prismaService.user.update({
      where: {
        email: user.email,
      },
      data: {
        username: user.username,
        email: user.email,
        password: user.password,
      },
    });

    return {
      username: result.username,
      email: result.email,
    };
  }

  async logout(user: User): Promise<UserResponse> {
    const result = await this.prismaService.user.update({
      where: {
        email: user.email,
      },
      data: {
        token: null,
      },
    });

    return {
      username: result.username,
      email: result.email,
    };
  }
}
