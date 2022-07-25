import { Inject } from "@nestjs/common";
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from "nest-winston";

export class SkinRemovedEvent {

    constructor(
        public readonly uuid: string,

    ) {
        console.log(`new SkinRemovedEvent() uuid:${this.uuid}`)

    }
}