import { Inject } from "@nestjs/common";
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from "nest-winston";

export class AssetAddedEvent {
    constructor(
        public readonly uuid: string,

    ) {
        console.log(`new AssetAddedEvent() uuid:${this.uuid}`)
    }
}