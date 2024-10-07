/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ValidationService } from '../common/validation.service';
import { PrismaService } from '../common/prisma.service';

@Module({
  providers: [UserService, ValidationService, PrismaService],
  controllers: [UserController],
})
export class UserModule {}
