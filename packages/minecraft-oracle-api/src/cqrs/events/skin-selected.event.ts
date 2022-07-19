import { Inject } from "@nestjs/common";
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from "nest-winston";

export class SkinSelectedEvent {

    constructor(
        public readonly uuid: string,

    ) {
        console.log(`new SkinSelectedEvent() uuid:${this.uuid}`)

    }
}