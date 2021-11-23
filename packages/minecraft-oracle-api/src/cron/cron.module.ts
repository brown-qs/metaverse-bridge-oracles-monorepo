import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AssetModule } from '../asset/asset.module';
import { OracleModule } from '../oracle/oracle.module';
import { AssetWatchService } from './assetWatch.service';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        AssetModule,
        OracleModule
    ],
    providers: [AssetWatchService],
    exports: [AssetWatchService],
    controllers: []
})
export class CronModule {}
