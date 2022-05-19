import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyntheticPartEntity } from './syntheticpart.entity';
import { SyntheticPartService } from './syntheticpart.service';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([SyntheticPartEntity]))
    ],
    providers: [SyntheticPartService],
    exports: [SyntheticPartService],
    controllers: []
})
export class SyntheticPartModule {}
