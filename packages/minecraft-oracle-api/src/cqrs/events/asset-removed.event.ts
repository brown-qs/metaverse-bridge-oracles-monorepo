import { Inject } from "@nestjs/common";
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from "nest-winston";

export class AssetRemovedEvent {
    constructor(
        public readonly uuid: string,

    ) {
        console.log(`new AssetRemovedEvent() uuid:${this.uuid}`)
    }
}