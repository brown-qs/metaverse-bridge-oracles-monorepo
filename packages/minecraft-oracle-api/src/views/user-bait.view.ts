import { Post } from "@nestjs/common";
import { Category } from "fp-ts/lib/Reader";
import { ViewEntity, Connection, ViewColumn, Column } from "typeorm";
import { ResourceInventoryEntity } from "../resourceinventory/resourceinventory.entity";
import { ResourceInventoryOffsetEntity } from "../resourceinventoryoffset/resourceinventoryoffset.entity";
import { UserEntity } from "../user/user/user.entity";

@ViewEntity({
    expression: (connection: Connection) => {

        //add limit so view is not editable
        //https://stackoverflow.com/questions/58026241/how-to-create-a-read-only-view-in-postgresql-similar-to-oracle

        const amountDecimal = "CAST(resource_inventory.amount as NUMERIC(78))/1e18"
        const offsetDecimal = "CAST(resource_inventory_offset.amount as NUMERIC(78))/1e18"
        return connection.createQueryBuilder()
            .addSelect("resource_inventory.ownerUuid", "uuid")
            .addSelect("resource_inventory.amount", "amount")
            .addSelect("resource_inventory_offset.amount", "offset")
            .addSelect(amountDecimal, "amountDecimal")
            .addSelect(offsetDecimal, "offsetDecimal")
            .addSelect(`${amountDecimal}-COALESCE(${offsetDecimal},0)`, "balance")
            .addSelect("user.email", "email")
            .addSelect("user.minecraftUserName", "minecraftUserName")
            .from(ResourceInventoryEntity, "resource_inventory")
            .where(`resource_inventory.assetId = '14'`)
            .leftJoin(UserEntity, "user", "user.uuid = resource_inventory.ownerUuid")
            .leftJoin(ResourceInventoryOffsetEntity, "resource_inventory_offset", "resource_inventory.id = resource_inventory_offset.resourceInventoryId")
            .orderBy("resource_inventory.ownerUuid", "ASC")
            .limit(1000 * 1000 * 1000)

    }
})
export class ZUserBaitView {

}