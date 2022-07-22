import { Inject } from "@nestjs/common";
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from "nest-winston";

export class ResourceInventoryUpdatedEvent {

    constructor(
        public readonly uuid: string,

    ) {
        console.log(`new ResourceInventoryUpdatedEvent() uuid:${this.uuid}`)

    }
}