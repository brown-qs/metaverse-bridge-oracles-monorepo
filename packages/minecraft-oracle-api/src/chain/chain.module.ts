import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChainEntity } from './chain.entity';
import { ChainService } from './chain.service';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([ChainEntity]))
    ],
    providers: [ChainService],
    exports: [ChainService],
    controllers: []
})
export class ChainModule {}
