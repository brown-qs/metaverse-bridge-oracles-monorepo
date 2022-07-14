import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { EmailChangeEntity } from './email-change.entity';
import { EmailChangeService } from './email-change.service';

@Module({
  imports: [
    forwardRef(() => TypeOrmModule.forFeature([EmailChangeEntity])),
    UserModule
  ],
  providers: [EmailChangeService],
  exports: [EmailChangeService]
})
export class EmailChangeModule { }
