import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompositePartEntity } from './compositepart.entity';
import { CompositePartService } from './compositepart.service';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([CompositePartEntity]))
    ],
    providers: [CompositePartService],
    exports: [CompositePartService],
    controllers: []
})
export class CompositePartModule {}
