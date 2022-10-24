import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyntheticSubItemEntity } from './syntheticsubitem.entity';
import { SyntheticSubItemService } from './syntheticsubitem.service';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([SyntheticSubItemEntity]))
    ],
    providers: [SyntheticSubItemService],
    exports: [SyntheticSubItemService],
    controllers: []
})
export class SyntheticSubItemModule { }
