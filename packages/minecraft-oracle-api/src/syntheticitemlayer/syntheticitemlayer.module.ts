import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyntheticItemLayerEntity } from './syntheticitemlayer.entity';
import { SyntheticItemLayerService } from './syntheticitemlayer.service';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([SyntheticItemLayerEntity]))
    ],
    providers: [SyntheticItemLayerService],
    exports: [SyntheticItemLayerService],
    controllers: []
})
export class SyntheticItemLayerModule { }
