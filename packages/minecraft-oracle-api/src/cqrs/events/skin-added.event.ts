import { Inject } from "@nestjs/common";
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from "nest-winston";

export class SkinAddedEvent {

    constructor(
        public readonly uuid: string,

    ) {
        console.log(`new SkinAddedEvent() uuid:${this.uuid}`)
    }
}