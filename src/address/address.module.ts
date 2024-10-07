import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { ContactModule } from '../contact/contact.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [ContactModule, CommonModule],
  providers: [AddressService],
  controllers: [AddressController],
})
export class AddressModule {}
