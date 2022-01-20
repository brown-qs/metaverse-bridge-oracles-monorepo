import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AssetModule } from '../asset/asset.module';
import { OracleApiModule } from '../oracleapi/oracleapi.module';
import { AssetWatchService } from './assetWatch.service';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        AssetModule,
        OracleApiModule
    ],
    providers: [AssetWatchService],
    exports: [AssetWatchService],
    controllers: []
})
export class CronModule {}
