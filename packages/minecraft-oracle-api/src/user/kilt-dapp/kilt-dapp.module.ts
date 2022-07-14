import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KiltDappEntity } from './kilt-dapp.entity';
import { KiltDappService } from './kilt-dapp.service';

@Module({
  imports: [
    forwardRef(() => TypeOrmModule.forFeature([KiltDappEntity]))
  ],
  providers: [KiltDappService],
  exports: [KiltDappService]

})
export class KiltDappModule { }
