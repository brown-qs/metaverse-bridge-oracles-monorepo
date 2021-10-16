import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecretEntity } from './secret.entity';
import { SecretService } from './secret.service';

@Module({
    imports: [
        forwardRef(() => TypeOrmModule.forFeature([SecretEntity]))
    ],
    providers: [SecretService],
    exports: [SecretService]
})
export class SecretModule {}
