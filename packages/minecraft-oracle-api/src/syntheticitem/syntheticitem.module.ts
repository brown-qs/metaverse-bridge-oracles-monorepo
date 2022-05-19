import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyntheticItemEntity } from './syntheticitem.entity';
import { SyntheticItemService } from './syntheticitem.service';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([SyntheticItemEntity]))
    ],
    providers: [SyntheticItemService],
    exports: [SyntheticItemService],
    controllers: []
})
export class SyntheticItemModule {}
