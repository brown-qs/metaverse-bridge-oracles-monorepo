import { ApiProperty } from "@nestjs/swagger"
import { ExportDto } from "../../oracleapi/dtos/export.dto";
import { SummonDto } from "../../oracleapi/dtos/summon.dto";
import { OracleActionTypeDto } from "./confirm.dto";

/*
export class OracleRequestDto {

    @ApiProperty({ description: 'User uuid' })
    uuid: string;

    @ApiProperty({ description: 'Data' })
    data: ImportDto | ExportDto | SummonDto

    @ApiProperty({ description: 'Type', enum: OracleActionTypeDto })
    type: OracleActionTypeDto;
}

export class OracleRequestsDto {

    @ApiProperty({ description: 'List of requests', type: [OracleRequestDto] })
    confirms: OracleRequestDto[]
}*/