import { Module } from '@nestjs/common';
import { Oauth2ResourceService } from './oauth2-resource.service';

@Module({
  providers: [Oauth2ResourceService],
  exports: [Oauth2ResourceService]
})
export class Oauth2ResourceModule { }
