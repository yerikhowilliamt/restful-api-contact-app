/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  providers: [ContactService],
  controllers: [ContactController],

  exports: [ContactService],
})
export class ContactModule {}
