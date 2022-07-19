import { forwardRef, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user/user.entity';
import { UserRelationsUpdatedHandler } from './commands/handlers/user-relations-updated.handler';
import { UserRelationsUpdatedSaga } from './sagas/user-relations-updated.saga';

@Module({
    imports: [forwardRef(() => TypeOrmModule.forFeature([UserEntity])), CqrsModule
    ],
    providers: [UserRelationsUpdatedSaga, UserRelationsUpdatedHandler,]
})
export class MoonsamaCqrsModule {

}
