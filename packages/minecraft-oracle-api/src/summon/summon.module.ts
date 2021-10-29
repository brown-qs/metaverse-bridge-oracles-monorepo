import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SummonEntity } from './summon.entity';
import { SummonService } from './summon.service';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([SummonEntity]))
    ],
    providers: [SummonService],
    exports: [SummonService],
    controllers: []
})
export class SummonModule {}
