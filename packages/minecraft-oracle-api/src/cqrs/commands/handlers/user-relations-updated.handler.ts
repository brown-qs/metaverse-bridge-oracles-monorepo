import { Inject } from "@nestjs/common";
import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from "nest-winston";
import { Repository } from "typeorm";
import { UserEntity } from "../../../user/user/user.entity";
import { UserRelationsUpdatedCommand } from "../user-relations-updated.command";

@CommandHandler(UserRelationsUpdatedCommand)
export class UserRelationsUpdatedHandler implements ICommandHandler<UserRelationsUpdatedCommand> {
    private readonly context: string;
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger,
        @InjectRepository(UserEntity) private readonly repository: Repository<UserEntity>,

    ) {
        this.context = UserRelationsUpdatedHandler.name

    }

    async execute(command: UserRelationsUpdatedCommand) {
        this.logger.debug(`UserRelationsUpdatedHandler::execute userUuid: ${command.uuid}`, this.context)
        await this.repository.update({ uuid: command.uuid }, { relationsUpdatedAt: new Date() })
    }
}