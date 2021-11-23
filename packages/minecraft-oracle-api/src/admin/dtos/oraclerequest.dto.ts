import { ApiProperty } from "@nestjs/swagger"
import { ExportDto } from "../../oracle/dtos/export.dto";
import { ImportDto } from "../../oracle/dtos/import.dto";
import { SummonDto } from "../../oracle/dtos/summon.dto";
import { OracleActionTypeDto } from "./confirm.dto";

export class OracleRequestDto {

    @ApiProperty({ description: 'User uuid'})
    uuid: string;

    @ApiProperty({ description: 'Data'})
    data: ImportDto | ExportDto | SummonDto

    @ApiProperty({ description: 'Type'})
    type: OracleActionTypeDto;
}

export class OracleRequestsDto {

    @ApiProperty({ description: 'List of requests'})
    confirms: OracleRequestDto[]
}