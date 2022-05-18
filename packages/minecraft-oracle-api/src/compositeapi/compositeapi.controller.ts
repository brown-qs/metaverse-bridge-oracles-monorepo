import {
    Controller,
    Get,
    Put,
    Post,
    Body,
    HttpCode,
    Inject,
    UnprocessableEntityException,
    Param,
    UseGuards
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WinstonLogger, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@ApiTags('moonsama')
@Controller('moonsama')
export class CompositeApiController {

    private readonly context: string;

    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
    ) {
        this.context = CompositeApiController.name;
    }
}
